// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import ENV from 'houseninja/config/environment';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import SecureStorage from 'houseninja/utils/secure-storage';
import HTTP, { encodeFormData } from 'houseninja/utils/http';
import { isEqual, isEmpty } from '@ember/utils';
import { later, cancel } from '@ember/runloop';
import { debug } from '@ember/debug';
import { Browser } from '@capacitor/browser';
import { startSpan } from 'houseninja/utils/sentry';
import { HttpResponse } from '@capacitor/core';
import type { EmberRunTimer } from '@ember/runloop/types';
import type EventBusService from 'houseninja/services/event-bus';
import { service } from '@ember/service';

type StashTokenPayload =
  | {
      code_challenge: string;
      code_verifier: string;
      state: string;
    }
  | undefined;

type AuthTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
};

type ModifiedAuthTokenResponse = AuthTokenResponse & {
  expires_at?: number;
  userinfo?: AuthUserInfo;
  kind: 'pkce';
};

type AuthUserInfo = {
  name?: string;
  email?: string;
  email_verified?: boolean;
  sub?: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
};

type ModifiedAuthUserInfo = AuthUserInfo & {
  user_id?: string;
};

const STASH_TOKEN = 'PKCE';

/**
 * Generate a code_verifier
 */
function generateCodeVerifier(): string {
  const length = 60; // Byte Length
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Generate a code_challenge
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const digest: ArrayBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Authenticator that conforms to OAuth 2 ([RFC 6749](http://tools.ietf.org/html/rfc6749)),
 * specifically the _"Resource Owner Password Credentials Grant Type"_.
 * This authenticator also automatically refreshes access tokens (see [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6))
 * if the server supports it.
 *
 * @example
 *   // routes/login.js
 *   const { codeVerifier, codeChallenge, loginUrl } = this.authenticate('authenticator:pkce-challenge', )
 *
 * @see https://auth0.com/docs/login/authentication/add-login-using-the-authorization-code-flow-with-pkce
 * @note In case I ever ask about this again: "Ember CLI will automatically register your customer authenticator in app/authenticators/* as authenticator:*"
 * @class PKCEAuthenticator
 * @module ember-simple-auth/authenticators/oauth2-pkce
 * @extends BaseAuthenticator
 */
export default class PKCEAuthenticator extends BaseAuthenticator {
  @service declare eventBus: EventBusService;

  /**
   * The client_id to be sent to the authentication server (see
   * https://tools.ietf.org/html/rfc6749#appendix-A.1). __This should only be
   * used for statistics or logging etc. as it cannot actually be trusted since
   * it could have been manipulated on the client!__
   *
   * @property clientId
   * @type String
   * @default null
   * @public
   */
  clientId = `${ENV.auth.client_id}`;

  /**
   * The endpoint on the server that authorization redirects
   * are sent to.
   *
   * @property serverAuthorizationEndpoint
   * @type String
   * @default '/authorize'
   * @public
   */
  serverAuthorizationEndpoint = `https://${ENV.auth.domain}/authorize`;

  /**
   * The endpoint on the server that token and token refresh requests
   * are sent to.
   *
   * @property serverTokenEndpoint
   * @type String
   * @default '/oauth/token'
   * @public
   */
  serverTokenEndpoint = `https://${ENV.auth.domain}/oauth/token`;

  /**
   * The endpoint on the server that token revocation requests are sent to. Only
   * set this if the server actually supports token revocation. If this is
   * `null`, the authenticator will not revoke tokens on session invalidation.
   * __If token revocation is enabled but fails, session invalidation will be
   * intercepted and the session will remain authenticated (see
   * {{#crossLink "OAuth2PasswordGrantAuthenticator/invalidate:method"}}{{/crossLink}}).__
   *
   * @property serverTokenRevocationEndpoint
   * @type String
   * @default null
   * @public
   */
  serverTokenRevocationEndpoint = `https://${ENV.auth.domain}/oauth/revoke`;

  /**
   * Logout endpoint for external auth
   * @type String
   * @default null
   * @public
   */
  get logoutEndpoint(): string {
    return `https://${ENV.auth.domain}/v2/logout?client_id=${this.clientId}`;
  }

  /**
   * The endpoint on the server that yields user info data.
   *
   * @type String
   * @default null
   * @public
   */
  userInfoEndpoint = `https://${ENV.auth.domain}/userinfo`;

  /**
   * The client-side redirectUri path. Be sure to include it in your `router.js`
   * file.
   *
   * @property redirectUri
   * @type String
   * @default '/login'
   * @public
   */
  get redirectUri(): string {
    if (isNativePlatform()) {
      const showLocal: string =
        ENV.environment === 'mobile' || ENV.environment === 'development'
          ? 'localhost:4200/'
          : '';
      return `${ENV.appScheme}://${showLocal}#/login/callback`;
    } else {
      // return `${ENV.appHost}/login/callback`;
      const location: string = window.location.origin;
      return `${location}/login/callback`;
    }
  }

  /**
   * Sets whether the authenticator automatically refreshes access tokens if the
   * server supports it.
   *
   * @property refreshAccessTokens
   * @type Boolean
   * @default true
   * @public
   */
  refreshAccessTokens = true;

  /**
   * The refresh leeway for managing clock drift
   * Expressed in seconds
   *
   * @property refreshLeeway
   * @type {Number}
   * @default 60 (1 minute)
   * @public
   */
  refreshLeeway = 60;

  /**
   * The unique `aud` or audience identifier attached to the grant request. Most
   * commonly set to the API root endpoint you are authorizing access to.
   *
   * @property audience
   * @type String
   * @default null;
   * @public
   */
  audience = `${ENV.auth.audience}`;

  /**
   * The requested access scopes
   *
   * @property scope
   * @type String
   * @default 'openid profile offline_access'
   * @public
   */
  scope = 'openid profile email offline_access';

  /**
   * Property to store scheduled refresh
   *
   * @property _upcomingRefresh
   * @type {Function}
   * @private
   */
  _upcomingRefresh: EmberRunTimer | undefined;

  /**
   * Generate an authorization URL for logging in
   *
   * @method generateAuthorizationURL
   * @return {String}
   */
  async generateAuthorizationURL(): Promise<string> {
    await SecureStorage.set('login', { state: 'started' });
    const rootURL: string = this.serverAuthorizationEndpoint;
    const code_verifier: string = generateCodeVerifier();
    const code_challenge: string = await generateCodeChallenge(code_verifier);
    const code_challenge_method = 'S256';
    const client_id: string = this.clientId;
    const redirect_uri: string = this.redirectUri;
    const audience: string = this.audience;
    const scope: string = this.scope;
    const state: string = generateCodeVerifier();

    // Clear stash then set state, verifier, challenge
    await SecureStorage.clear(STASH_TOKEN);
    await SecureStorage.set(STASH_TOKEN, {
      code_challenge,
      code_verifier,
      state,
    });

    // assemble authentication query params
    const params: string = [
      `response_type=code`,
      `code_challenge=${code_challenge}`,
      `code_challenge_method=${code_challenge_method}`,
      `client_id=${encodeURIComponent(client_id)}`,
      `redirect_uri=${encodeURIComponent(redirect_uri)}`,
      `audience=${encodeURIComponent(audience)}`,
      `scope=${encodeURIComponent(scope)}`,
      `state=${state}`,
    ]
      .filter(Boolean)
      .join('&');

    return `${rootURL}?${params}`;
  }

  /**
   * Authenticate with authorization response. This exchanges
   * the auth code response for access, id, and refresh tokens.
   *
   * @method authenticate
   * @param {String} code
   * @param {String} state
   */
  // eslint-disable-next-line prettier/prettier
  async authenticate(code: string, state: string): Promise<ModifiedAuthTokenResponse> {
    const span = startSpan({
      op: 'auth.authenticate',
      description: 'PKCE: authenticate',
    });

    let error: Error | undefined = undefined;

    if (!code) {
      error = new Error('authCode is missing');
    }
    if (!state || !this._isValidState(state)) {
      error = new Error('state is missing or invalid');
    }

    if (error) {
      span?.setStatus('error');
      span?.finish();
      throw error;
    }

    const stashToken: StashTokenPayload = (await SecureStorage.get(
      STASH_TOKEN
    )) as StashTokenPayload;
    const code_verifier: string | undefined = stashToken?.code_verifier;

    const params = {
      grant_type: 'authorization_code',
      client_id: encodeURIComponent(this.clientId),
      code_verifier: code_verifier,
      code: code,
      redirect_uri: encodeURIComponent(this.redirectUri),
    };

    // fetch token data
    const res: AuthTokenResponse = ((await this._post(
      this.serverTokenEndpoint,
      params
    )) || {}) as AuthTokenResponse;

    if (isEmpty(res?.refresh_token)) {
      debug(
        `PKCEAuthenticator#authenticate - failed token exchange with params: ${JSON.stringify(
          params
        )}`
      );
      span?.setStatus('error');
      span?.finish();
      throw new Error('failed token exchange');
    }

    const data: ModifiedAuthTokenResponse = {
      ...res,
      kind: 'pkce',
    };

    // // clear spent code challenge and verifier
    // await SecureStorage.clear(STASH_TOKEN);

    // calculate token expiration
    const expires_at: number = new Date().getTime() + (data.expires_in + 1000);
    data.expires_at = expires_at;

    // schedule token refresh for later
    await this._scheduleRefresh(data.expires_in, data.refresh_token);

    // fetch user info
    data.userinfo = await this._getUserinfo(data.access_token);

    // set kind
    data.kind = 'pkce';

    span?.setStatus('succeess');
    span?.finish();

    return data;
  }

  /**
   * Restore the session after a page refresh. This will check if an access
   * token exists and tries to refresh said token. If the refresh token is
   * already expired, the auth backend will throw an error which will cause a
   * new login.
   *
   * @method restore
   * @param {Object} data The current session data
   * @param {String} data.access_token The raw access token
   * @param {String} data.refresh_token The raw refresh token
   * @returns {Promise} A promise which resolves with the session data
   * @public
   */
  // eslint-disable-next-line prettier/prettier
  async restore(data: ModifiedAuthTokenResponse): Promise<ModifiedAuthTokenResponse> {
    const span = startSpan({
      op: 'auth.restore',
      description: 'PKCE: restoring session',
    });

    const { refresh_token, expires_at, expires_in } = data;

    if (!refresh_token) {
      span?.setStatus('error');
      span?.finish();
      throw new Error('Refresh token is missing');
    }

    // if the token has expired already, try to refresh it
    if (expires_at && expires_at <= new Date().getTime()) {
      span?.setStatus('expired');
      span?.finish();
      return await this._refresh(refresh_token);
    }

    // schedule token refresh for later
    this._scheduleRefresh(expires_in, refresh_token);

    span?.setTag('expires_in', expires_in);

    // fetch user info
    data.userinfo = await this._getUserinfo(data.access_token);

    span?.setStatus('success');
    span?.finish();

    return data;
  }

  /**
   * If token revocation is enabled, this will revoke the access token (and the
   * refresh token if present). If token revocation succeeds, this method
   * returns a resolving promise, otherwise it will return a rejecting promise,
   * thus intercepting session invalidation.
   * If token revocation is not enabled this method simply returns a resolving
   * promise.
   *
   * @method invalidate
   * @param {Object} data The current authenticated session data
   * @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated. If invalidation fails, the promise will reject with the server response (in case token revocation is used); however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
   * @public
   */
  async invalidate(data: ModifiedAuthTokenResponse): Promise<void> {
    const span = startSpan({
      op: 'auth.invalidate',
      description: 'PKCE: invalidating session',
    });

    await SecureStorage.clear(`${STASH_TOKEN}:refresh_token`);

    // cancel any scheduled future token refresh
    cancel(this._upcomingRefresh);

    // if no revocation endpoint, do nothing
    if (isEmpty(this.serverTokenRevocationEndpoint)) {
      span?.setStatus('success');
      span?.finish();
      return;
    }

    const { access_token, refresh_token } = data;

    // invalidate the access token if it exists
    if (!isEmpty(access_token)) {
      const params = {
        token_type_hint: 'access_token',
        token: access_token,
      };
      await this._post(this.serverTokenEndpoint, params);
    }

    // invalidate the refresh token if it exists
    if (!isEmpty(refresh_token)) {
      const params = {
        token_type_hint: 'refresh_token',
        token: refresh_token,
      };
      await this._post(this.serverTokenEndpoint, params);
    }

    span?.setStatus('success');
    span?.finish();

    if (isNativePlatform()) {
      startSpan({
        op: 'browser.open',
        description: `OPEN: ${this.logoutEndpoint}`,
      })?.finish();

      this.eventBus.one('browser.browser-page-loaded', () => {
        startSpan({
          op: 'browser.close',
          description: `CLOSE: ${this.logoutEndpoint}`,
        })?.finish();
        Browser.close();
      });

      await Browser.open({
        url: this.logoutEndpoint,
        presentationStyle: 'popover',
      });
    }

    return;
  }

  /**
   * Refresh the access token
   *
   * @method _refresh
   * @param {String} refresh_token The refresh token
   * @returns {Object} The parsed response data
   * @private
   */
  // eslint-disable-next-line prettier/prettier
  async _refresh(refresh_token: string /*, retryCount = 0 */): Promise<ModifiedAuthTokenResponse> {
    const span = startSpan({
      op: 'auth.refresh',
      description: 'PKCE: refreshing token',
    });

    // Stash
    const stashed_refresh_token = await SecureStorage.get(
      `${STASH_TOKEN}:refresh_token`
    );

    const params = {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      refresh_token: refresh_token || stashed_refresh_token,
    };

    const res = ((await this._post(this.serverTokenEndpoint, params)) ??
      {}) as AuthTokenResponse;
    const data: ModifiedAuthTokenResponse = {
      ...res,
      kind: 'pkce',
    };

    const expires_at = new Date().getTime() + (data.expires_in + 1000);
    data.expires_at = expires_at;
    await this._scheduleRefresh(data.expires_in, data.refresh_token);
    span?.setTag('expires_in', data.expires_in);
    span?.finish();
    return data;
  }

  /**
   * Schedule a refresh of the access token.
   * This refresh needs to happen before the access token actually expires.
   *
   * @see https://github.com/adfinis-sygroup/ember-simple-auth-oidc/blob/master/addon/authenticators/oidc.js#L202
   * @param {Number} expireTime Timestamp in milliseconds at which the access token expires
   * @param {String} token The refresh token
   */
  // eslint-disable-next-line prettier/prettier
  async _scheduleRefresh(expires_in: number, refresh_token: string): Promise<void> {
    startSpan({
      op: 'auth.schedule_refresh',
      description: 'PKCE: scheduling token refresh',
      tags: {
        expires_in,
      },
    })?.finish();

    // if token already expired, do nothing
    if (expires_in * 1000 <= new Date().getTime()) {
      return;
    }

    // if a token refresh is already scheduled, cancel it
    if (this._upcomingRefresh) {
      cancel(this._upcomingRefresh);
    }

    // Stash
    await SecureStorage.set(`${STASH_TOKEN}:refresh_token`, refresh_token);

    // calculate a random delta before token expiration
    const expiry: number =
      (expires_in - this.refreshLeeway) * 1000 - new Date().getTime();

    // schedule token refresh for later
    this._upcomingRefresh = later(
      // context this callback function will run in
      this,
      // callback function
      async (refresh_token) => {
        this.trigger('sessionDataUpdated', await this._refresh(refresh_token));
      },
      // pass the refresh_token into the callback function
      refresh_token,
      // call the function at this time
      expiry
    );

    debug(`auth - token refresh scheduled for ${expiry}`);
  }

  /**
   * check for login data
   */
  async loginDataExists(): Promise<boolean> {
    try {
      const data =
        ((await SecureStorage.get(STASH_TOKEN)) as StashTokenPayload) || {};
      if (Object.keys(data).length > 0) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * @private
   * @method _isValidState
   *
   * Validate the state param against storage
   *
   * @param {String} state
   * @return {Boolean}
   */
  async _isValidState(state: string): Promise<boolean> {
    const loginStash = (await SecureStorage.get(
      STASH_TOKEN
    )) as StashTokenPayload;
    const localState = loginStash?.state;
    return isEqual(localState, state);
  }

  /**
   * @private
   * @method _getUserinfo
   *
   * Request user information from the openid userinfo endpoint
   *
   * @param {String} accessToken The raw access token
   * @returns {Object} Object containing the user information
   */
  // eslint-disable-next-line prettier/prettier
  async _getUserinfo(accessToken: string): Promise<AuthUserInfo> {
    startSpan({
      op: 'auth.user_info',
      description: 'PKCE: fetching user info',
    })?.finish();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    };

    const res: AuthUserInfo = (await HTTP.get(
      this.userInfoEndpoint,
      headers
    )) as AuthUserInfo;

    const userinfo: ModifiedAuthUserInfo = {
      ...res,
      user_id: res?.sub?.replace('auth0|', ''),
    };

    return userinfo;
  }

  /**
   * @private
   * @method _post
   *
   * HTTP Request for appropriate platform (native mobile or web)
   *
   * @param {String} url
   * @param {Object} params
   */
  // eslint-disable-next-line prettier/prettier
  async _post(url: string, params = {}): Promise<HttpResponse | void> {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    params = encodeFormData(params);
    return await HTTP.post(url, headers, params);
  }
}
