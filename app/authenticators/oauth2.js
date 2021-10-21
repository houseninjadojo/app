import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class OAuth2Authenticator extends OAuth2PasswordGrantAuthenticator {
  // Endpoint for token auth
  serverTokenEndpoint = 'https://api.houseninja.co/oauth/token';

  // Endpoint for token revocation
  serverTokenRevocationEndpoint = 'https://api.houseninja.co/oauth/revoke';
}
