import JSONWebTokenAuthenticator from 'ember-simple-auth-token/authenticators/jwt';
import ENV from 'dojo/config/environment';

/**
  JWT (JSON Web Token) Authenticator that supports automatic token refresh.
  The factory for this authenticator is registered as 'authenticator:jwt` in Ember's container.
  @see https://github.com/fenichelar/ember-simple-auth-token/blob/master/addon/authenticators/jwt.js
  @class JWT
  @namespace SimpleAuth.Authenticators
  @module ember-simple-auth-token/authenticators/jwt
  @extends JSONWebTokenAuthenticator
*/
export default class JWTAuthenticator extends JSONWebTokenAuthenticator {
  // Endpoint for token auth
  get serverTokenEndpoint() {
    return `${ENV.authHost}/oauth/token`;
  }

  // Endpoint for token refresh
  get serverTokenRefreshEndpoint() {
    return `${ENV.authHost}/oauth/token`;
  }

  /**
   * @private
   */
  set serverTokenRefreshEndpoint(v) {
    return;
  }
  set serverTokenEndpoint(v) {
    return;
  }
}
