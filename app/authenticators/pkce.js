// import RSVP from 'rsvp';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import ENV from 'houseninja/config/environment';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { isEqual, isEmpty } from '@ember/utils';
import { Http as MobileHTTP } from '@capacitor-community/http';
import { later, cancel, run } from '@ember/runloop';
import { debug } from '@ember/debug';

const STASH_TOKEN = 'PKCE';

/**
 * Generate a code_verifier
 */
function generateCodeVerifier() {
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
async function generateCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
  Authenticator that conforms to OAuth 2 ([RFC 6749](http://tools.ietf.org/html/rfc6749)),
  specifically the _"Resource Owner Password Credentials Grant Type"_.
  This authenticator also automatically refreshes access tokens (see [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6))
  if the server supports it.

  @example
    // routes/login.js
    const { codeVerifier, codeChallenge, loginUrl } = this.authenticate('authenticator:pkce-challenge', )

  @see https://auth0.com/docs/login/authentication/add-login-using-the-authorization-code-flow-with-pkce
  @note In case I ever ask about this again: "Ember CLI will automatically register your customer authenticator in app/authenticators/* as authenticator:*"
  @class PKCEAuthenticator
  @module ember-simple-auth/authenticators/oauth2-pkce
  @extends BaseAuthenticator
*/
export default class PKCEAuthenticator extends BaseAuthenticator {
  /**
    The client_id to be sent to the authentication server (see
    https://tools.ietf.org/html/rfc6749#appendix-A.1). __This should only be
    used for statistics or logging etc. as it cannot actually be trusted since
    it could have been manipulated on the client!__
    @property clientId
    @type String
    @default null
    @public
  */
  clientId = `${ENV.auth.client_id}`;

  /**
    The endpoint on the server that authorization redirects
    are sent to.
    @property serverAuthorizationEndpoint
    @type String
    @default '/authorize'
    @public
  */
  serverAuthorizationEndpoint = `https://${ENV.auth.domain}/authorize`;

  /**
    The endpoint on the server that token and token refresh requests
    are sent to.
    @property serverTokenEndpoint
    @type String
    @default '/oauth/token'
    @public
  */
  serverTokenEndpoint = `https://${ENV.auth.domain}/oauth/token`;

  /**
    The endpoint on the server that token revocation requests are sent to. Only
    set this if the server actually supports token revocation. If this is
    `null`, the authenticator will not revoke tokens on session invalidation.
    __If token revocation is enabled but fails, session invalidation will be
    intercepted and the session will remain authenticated (see
    {{#crossLink "OAuth2PasswordGrantAuthenticator/invalidate:method"}}{{/crossLink}}).__
    @property serverTokenRevocationEndpoint
    @type String
    @default null
    @public
  */
  serverTokenRevocationEndpoint = `https://${ENV.auth.domain}/oauth/revoke`;

  /**
    The endpoint on the server that yields user info data.
    @type String
    @default null
    @public
  */
  userInfoEndpoint = `https://${ENV.auth.domain}/userinfo`;

  /**
    The client-side redirectUri path. Be sure to include it in your `router.js`
    file.
    @property redirectUri
    @type String
    @default '/login'
    @public
  */
  get redirectUri() {
    if (isNativePlatform()) {
      return `${ENV.appScheme}://localhost:4200/login/callback`;
    } else {
      return `${ENV.appHost}/login/callback`;
    }
  }

  /**
    Sets whether the authenticator automatically refreshes access tokens if the
    server supports it.
    @property refreshAccessTokens
    @type Boolean
    @default true
    @public
  */
  refreshAccessTokens = true;

  /**
   * The refresh leeway for managing clock drift
   * Expressed in seconds
   * @property refreshLeeway
   * @type {Number}
   * @default 60 (1 minute)
   * @public
   */
  refreshLeeway = 60;

  /**
    The unique `aud` or audience identifier attached to the grant request. Most
    commonly set to the API root endpoint you are authorizing access to.
    @property audience
    @type String
    @default null;
    @public
  */
  audience = `${ENV.auth.audience}`;

  /**
   * The requested access scopes
   * @property scope
   * @type String
   * @default 'openid profile offline_access'
   * @public
   */
  scope = 'openid profile email offline_access';

  /**
   * Property to store scheduled refresh
   * @property _upcomingRefresh
   * @type {Function}
   * @private
   */
  _upcomingRefresh = null;

  /**
   * Generate an authorization URL for logging in
   * @method generateAuthorizationURL
   * @return {String}
   */
  async generateAuthorizationURL() {
    await this.stashData('login', { state: 'started' });
    const rootURL = this.serverAuthorizationEndpoint;
    const code_verifier = generateCodeVerifier();
    const code_challenge = await generateCodeChallenge(code_verifier);
    const code_challenge_method = 'S256';
    const client_id = this.clientId;
    const redirect_uri = this.redirectUri;
    const audience = this.audience;
    const scope = this.scope;
    const state = generateCodeVerifier();

    // Stash state, verifier, challenge
    await this.stashData(STASH_TOKEN, {
      code_challenge,
      code_verifier,
      state,
    });

    const params = [
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

    debug(`auth url code_challenge: ${code_challenge}`);
    debug(`auth url code_verifier: ${code_verifier}`);
    debug(`auth url state: ${state}`);

    return `${rootURL}?${params}`;
  }

  /**
   * Authenticate with authorization response. This exchanges
   * the auth code response for access, id, and refresh tokens.
   * @method authenticate
   * @param {String} code
   * @param {String} state
   */
  async authenticate(code, state) {
    if (!code) {
      throw new Error('authCode is missing');
    }
    if (!state || !this._isValidState(state)) {
      throw new Error('state is missing or invalid');
    }

    const { code_verifier } = await this.unstashData(STASH_TOKEN);

    const postData = {
      grant_type: 'authorization_code',
      client_id: encodeURIComponent(this.clientId),
      code_verifier: code_verifier,
      code: code,
      redirect_uri: encodeURIComponent(this.redirectUri),
    };

    this.clearStash();
    debug('authenticate post data - code: ' + postData.code);
    debug('authenticate post data - code_verifier: ' + postData.code_verifier);

    let data = await this._post(this.serverTokenEndpoint, postData);

    let expires_at = new Date().getTime() + (data.expires_in + 1000);
    data.expires_at = expires_at;

    await this._scheduleRefresh(data.expires_in, data.refresh_token);

    debug('authenticate response data - access_token: ' + data.access_token);

    data.userinfo = await this._getUserinfo(data.access_token);

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
  async restore(data) {
    debug('restore - access_token: ' + data.access_token);
    debug('restore - refresh_token: ' + data.refresh_token);
    const { refresh_token, expires_at, expires_in } = data;

    if (!refresh_token) {
      throw new Error('Refresh token is missing');
    }

    if (expires_at && expires_at <= new Date().getTime()) {
      return await this._refresh(refresh_token);
    }
    this._scheduleRefresh(expires_in, refresh_token);

    data.userinfo = await this._getUserinfo(data.access_token);
    return data;
  }

  /**
    If token revocation is enabled, this will revoke the access token (and the
    refresh token if present). If token revocation succeeds, this method
    returns a resolving promise, otherwise it will return a rejecting promise,
    thus intercepting session invalidation.
    If token revocation is not enabled this method simply returns a resolving
    promise.
    @method invalidate
    @param {Object} data The current authenticated session data
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated. If invalidation fails, the promise will reject with the server response (in case token revocation is used); however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
    @public
  */
  async invalidate(data) {
    cancel(this._upcomingRefresh);
    if (isEmpty(this.serverTokenRevocationEndpoint)) {
      return;
    } else {
      const { access_token, refresh_token } = data;
      if (!isEmpty(access_token)) {
        let postData = {
          token_type_hint: 'access_token',
          token: access_token,
        };
        await this._post(this.serverTokenEndpoint, postData);
      }
      if (!isEmpty(refresh_token)) {
        let postData = {
          token_type_hint: 'refresh_token',
          token: refresh_token,
        };
        await this._post(this.serverTokenEndpoint, postData);
      }
      return;
    }
  }

  /**
   * Refresh the access token
   *
   * @method _refresh
   * @param {String} refresh_token The refresh token
   * @returns {Object} The parsed response data
   * @private
   */
  async _refresh(refresh_token /*, retryCount = 0 */) {
    debug('_refresh: ' + refresh_token);
    const postData = {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      refresh_token,
    };
    let data = await this._post(this.serverTokenEndpoint, postData);
    let expires_at = new Date().getTime() + (data.expires_in + 1000);
    data.expires_at = expires_at;
    await this._scheduleRefresh(data.expires_in, data.refresh_token);
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
  async _scheduleRefresh(expires_in, refresh_token) {
    debug('_scheduleRefresh: ' + refresh_token);
    if (expires_in * 1000 <= new Date().getTime()) {
      return;
    }

    if (this._upcomingRefresh) {
      cancel(this.upcomingRefresh);
    }

    this._upcomingRefresh = later(
      // the context this callback function will run in
      this,
      // the callback function
      async (refresh_token) => {
        this.trigger('sessionDataUpdated', await this._refresh(refresh_token));
      },
      // pass the refresh_token into the callback function
      refresh_token,
      // call this function in the millisecond delta until expiration
      (expires_in - this.refreshLeeway) * 1000 - new Date().getTime()
    );
  }

  /**
   * Stash token data safely
   * @method stashData
   * @param {String} key
   * @param {Object} data
   * @return {RSVP.Promise}
   */
  async stashData(key = STASH_TOKEN, data) {
    const value = JSON.stringify(data);
    return await run(async () => {
      return await SecureStoragePlugin.set({ key, value });
    });
  }

  /**
   * Fetch token data safely
   * @method unstashData
   * @param {String} key
   * @return {RSVP.Promise}
   */
  async unstashData(key = STASH_TOKEN) {
    let encodedValue = await run(async () => {
      return await SecureStoragePlugin.get({ key });
    });
    return JSON.parse(encodedValue.value);
  }

  /**
   * Clear stash data
   */
  async clearStash(key = STASH_TOKEN) {
    await run(async () => {
      try {
        await SecureStoragePlugin.remove({ key });
      } catch {
        //
      }
    });
    return;
  }

  /**
   * check for login data
   */
  async loginDataExists() {
    try {
      let data = await this.unstashData(STASH_TOKEN);
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
   * Validate the state param against storage
   * @method _isValidState
   * @param {String} state
   * @return {Boolean}
   * @private
   */
  async _isValidState(state) {
    const { state: localState } = await this.unstashData(STASH_TOKEN);
    return isEqual(localState, state);
  }

  /**
   * Request user information from the openid userinfo endpoint
   *
   * @param {String} accessToken The raw access token
   * @returns {Object} Object containing the user information
   */
  async _getUserinfo(accessToken) {
    const options = {
      url: this.userInfoEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };

    let response;
    try {
      response = await run(async () => {
        return await MobileHTTP.get(options);
      });
    } catch (e) {
      console.error(e);
    }

    const userinfo = response.data;
    userinfo.user_id = userinfo.sub.replace('auth0|', '');

    return userinfo;
  }

  /**
   * HTTP Request for appropriate platform (native mobile or web)
   * @method _post
   * @param {String} url
   * @param {Object} postData
   */
  async _post(url, postData = {}) {
    let response, data;
    if (isNativePlatform()) {
      const mobilePostData = postData;
      const postOptions = {
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: mobilePostData,
      };
      try {
        response = await run(async () => {
          return await MobileHTTP.post(postOptions);
        });
      } catch (e) {
        console.error(e);
      }
      data = response.data;
    } else {
      const webPostData = postData
        .map((k, v) => {
          return `${k}=${encodeURIComponent(v)}`;
        })
        .join('&');
      response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        webPostData,
      });
      data = await response.json();
    }
    return data;
  }
}
