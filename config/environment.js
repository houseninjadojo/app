'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'houseninja',
    environment,
    rootURL: '/',
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

    apiHost: 'https://api.dev.houseninja.co',
    appHost: 'http://localhost:4200',
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
      scope: 'openid profile email',
      screen_hint: 'login',
      useCookiesForTransactions: false,
      useRefreshTokens: true,
    },

    analytics: {
      mixpanelToken: null,
    },

    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },

    '@sentry/ember': {
      sentry: {
        dsn: null,
        tracesSampleRate: 1.0,
        debug: true,
        autoSessionTracking: true,
      },
      tracingOrigins: [
        'localhost:4200',
        'https://api.houseninja.co',
        'localhost',
        'co.houseninja.app://localhost',
      ],
    },
  };

  if (environment === 'development') {
    ENV.auth.audience = 'http://localhost:3000';
    ENV.auth.connection = 'dev';

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

    ENV['@sentry/ember'].sentry.debug = false;
  }

  if (environment === 'production') {
    ENV.appHost = 'https://app.houseninja.co';
    ENV.apiHost = 'https://api.houseninja.co';
    ENV.auth.audience = 'https://api.houseninja.co';
    ENV.auth.connection = 'prod';

    // Sentry
    ENV['@sentry/ember'].sentry.debug = false;
    ENV['@sentry/ember'].sentry.dsn = 'https://4263250e9c344c61bc6033d3a79d822a@o1061437.ingest.sentry.io/6051789';

    // Analytics
    ENV.analytics.mixpanelToken = 'cd20057a467eef665b9e86f0b687a5e3';
  }

  return ENV;
};
