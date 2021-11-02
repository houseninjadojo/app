'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'dojo',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    appHost: 'https://localhost:4200',
    appScheme: 'co.houseninja.app',

    /**
     * Auth0 Config
     * @see https://auth0.github.io/auth0-spa-js/interfaces/auth0clientoptions.html
     */
    auth: {
      audience: 'http://localhost:3000',
      // cache
      client_id: 'BY1EBCu3dN01Cl28OrcmJ3N1K5PqqFnF',
      connection: 'houseninja',
      // display: 'touch',
      // domain: 'dev-ctzabcoc.us.auth0.com',
      domain: 'auth.houseninja.co',
      // login_hint: 'user@email.com',
      prompt: 'none',
      // redirect_uri: 'https://app.houseninja.co/login',
      scope: '',
      screen_hint: 'login',
      useCookiesForTransactions: false,
      useRefreshTokens: true,
    },

    // 'ember-simple-auth-token': {
    //   refreshAccessTokens: true,
    //   refreshLeeway: 300, // refresh 5 minutes (300 seconds) before expiration
    // },
  };

  if (environment === 'development') {
    ENV.apiHost = 'https://api.dev.houseninja.co';
    ENV.auth.audience = 'http://localhost:3000';
    ENV.auth.connection = 'dev';
      // redirect_uri: 'http://localhost:4200',
      // host: 'https://api.dev.houseninja.co',
      // clientId: '',
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.appHost = 'https://app.houseninja.co';
    ENV.apiHost = 'https://api.houseninja.co';
    ENV.auth.audience = 'https://api.houseninja.co';
    ENV.auth.connection = 'prod';
    // here you can enable a production-specific feature
  }

  return ENV;
};
