'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'houseninja',
    environment,
    locationType: 'history',
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

    apiHost: process.env.API_HOST,
    appHost: process.env.APP_HOST,
    appScheme: 'co.houseninja.application',

    /**
     * Auth0 Config
     * @see https://auth0.github.io/auth0-spa-js/interfaces/auth0clientoptions.html
     */
    auth: {
      audience: process.env.AUTH_AUDIENCE,
      client_id: process.env.AUTH_CLIENT_ID,
      connection: process.env.AUTH_CONNECTION,
      domain: process.env.AUTH_DOMAIN,
      prompt: 'none',
      scope: 'openid profile email',
      screen_hint: 'login',
      useCookiesForTransactions: false,
      useRefreshTokens: true,
    },

    analytics: {
      mixpanelToken: process.env.MIXPANEL_TOKEN,
    },

    'ember-cli-mirage': {
      enabled: true,
    },

    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },

    intercom: {
      appId: process.env.INTERCOM_APP_ID,
      identityVerificationSecrets: {
        web: process.env.INTERCOM_IDENTITY_VERIFICATION_SECRET_WEB,
        ios: process.env.INTERCOM_IDENTITY_VERIFICATION_SECRET_IOS,
        android: process.env.INTERCOM_IDENTITY_VERIFICATION_SECRET_ANDROID,
      },
    },

    '@sentry/ember': {
      sentry: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        debug: false,
        environment,
        autoSessionTracking: true,
        release: process.env.CF_PAGES_COMMIT_SHA,
        browserTracingOptions: {
          tracingOrigins: [
            'api.houseninja.co',
            'sandbox.api.houseninja.co',
          ],
        }
      },
      enableComponentDefinition: true,
      disablePerformance: false,
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['@sentry/ember'].sentry.debug = true;
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

  if (environment === 'sandbox') {
    // Mirage
    ENV['ember-cli-mirage'].enabled = false;
  }

  if (environment === 'production') {
    // Mirage
    ENV['ember-cli-mirage'].enabled = false;
  }

  return ENV;
};
