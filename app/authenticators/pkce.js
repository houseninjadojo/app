// import RSVP from 'rsvp';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import ENV from 'dojo/config/environment';
import isNativePlatform from 'dojo/utils/is-native-platform';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { isEqual } from '@ember/utils';
import { Http as MobileHTTP } from '@capacitor-community/http';

const STASH_TOKEN = 'PKCE';

/**
 * Generate a code_verifier
 */
function generateCodeVerifier() {
  const length = 120; // Byte Length
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
  serverTokenRevocationEndpoint = null;

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
      return `${ENV.appScheme}://localhost:4200/login`;
    } else {
      return `${ENV.appHost}/login`;
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
    The unique `aud` or audience identifier attached to the grant request. Most
    commonly set to the API root endpoint you are authorizing access to.
    @property audience
    @type String
    @default null;
    @public
  */
  audience = '';

  /**
   * The requested access scopes
   * @property scope
   * @type String
   * @default 'openid profile offline_access'
   * @public
   */
  scope = 'openid profile offline_access';

  /**
   * Generate an authorization URL for logging in
   * @method generateAuthorizationURL
   * @return {String}
   */
  async generateAuthorizationURL() {
    const rootURL = this.serverAuthorizationEndpoint;
    const code_verifier = generateCodeVerifier();
    const code_challenge = await generateCodeChallenge(code_verifier);
    const code_challenge_method = 'S256';
    const client_id = this.clientId;
    const redirect_uri = this.redirectUri;
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
      `scope=${encodeURIComponent(scope)}`,
      `state=${state}`,
    ]
      .filter(Boolean)
      .join('&');

    console.log(`code_challenge: ${code_challenge}`);
    console.log(`code_verifier: ${code_verifier}`);
    console.log(`state: ${state}`);

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

    console.log('test');

    const { code_verifier } = await this.unstashData(STASH_TOKEN);

    const postData = [
      `grant_type=authorization_code`,
      `client_id=${encodeURIComponent(this.clientId)}`,
      `code_verifier=${code_verifier}`,
      `code=${code}`,
      `redirect_uri=${encodeURIComponent(this.redirectUri)}`,
    ].join('&');

    const mobilePostData = {
      grant_type: 'authorization_code',
      client_id: encodeURIComponent(this.clientId),
      code_verifier: code_verifier,
      code: code,
      redirect_uri: encodeURIComponent(this.redirectUri),
    };

    this.clearStash();
    console.log(postData);

    let response, data;
    if (isNativePlatform()) {
      const postOptions = {
        url: this.serverTokenEndpoint,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: mobilePostData,
      };
      try {
        response = await MobileHTTP.post(postOptions);
      } catch (e) {
        console.error(e);
      }
      data = response.data;
    } else {
      response = await fetch(this.serverTokenEndpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        postData,
      });
      data = await response.json();
    }

    console.log('authenticate data: ', data);

    return data;
  }

  /**
   * Stash token data safely
   * @method stashData
   * @param {String} key
   * @param {Object} data
   * @return {RSVP.Promise}
   */
  async stashData(key, data) {
    const value = JSON.stringify(data);
    return await SecureStoragePlugin.set({ key, value });
  }

  /**
   * Fetch token data safely
   * @method unstashData
   * @param {String} key
   * @return {RSVP.Promise}
   */
  async unstashData(key) {
    let encodedValue = await SecureStoragePlugin.get({ key });
    return JSON.parse(encodedValue.value);
  }

  /**
   * Clear stash data
   */
  async clearStash() {
    try {
      await SecureStoragePlugin.remove({ key: STASH_TOKEN });
    } catch {
      //
    }
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
}
