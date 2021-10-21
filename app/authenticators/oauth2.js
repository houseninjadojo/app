import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from 'dojo/config/environment';

/**
  Authenticator that conforms to OAuth 2 ([RFC 6749](http://tools.ietf.org/html/rfc6749)),
  specifically the _"Resource Owner Password Credentials Grant Type"_.
  This authenticator also automatically refreshes access tokens (see [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6))
  if the server supports it.
  @see https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/authenticators/oauth2-password-grant.js
  @class OAuth2Authenticator
  @module ember-simple-auth/authenticators/oauth2-password-grant
  @extends OAuth2PasswordGrantAuthenticator
*/
export default class OAuth2Authenticator extends OAuth2PasswordGrantAuthenticator {
  // Endpoint for token auth
  serverTokenEndpoint = `${ENV.authHost}/oauth/token`;

  // Endpoint for token revocation
  serverTokenRevocationEndpoint = `${ENV.authHost}/oauth/revoke`;
}
