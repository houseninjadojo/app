'use strict';

const pkg = require('../package.json');

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

    apiHost: 'https://api.dev.houseninja.co',
    appHost: 'http://localhost:4200',
    appScheme: 'co.houseninja.application',

    /**
     * Auth0 Config
     * @see https://auth0.github.io/auth0-spa-js/interfaces/auth0clientoptions.html
     */
    auth: {
      audience: 'http://localhost:3000',
      client_id: 'BY1EBCu3dN01Cl28OrcmJ3N1K5PqqFnF',
      connection: 'development',
      // display: 'touch',
      domain: 'sandbox.auth.houseninja.co',
      // login_hint: 'user@email.com',
      prompt: 'none',
      scope: 'openid profile email',
      screen_hint: 'login',
      useCookiesForTransactions: false,
      useRefreshTokens: true,
    },

    analytics: {
      mixpanelToken: null,
    },

    branch: {
      key: 'key_test_ggWUFKIMinJ3PAjl8Mh8BalcFrg00QSI',
    },

    'ember-cli-mirage': {
      enabled: true,
    },

    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },

    intercom: {
      appId: 'rgqc8u39',
      identityVerificationSecrets: {
        web: 'dejx2Tlkuw3l4TCN7JBKHvfG9qCgLWQy2Ga8NCyW',
        ios: 'azhgAa2K5NBb4qhImwqsr_0yCH540SsZyREnBVWN',
        android: 'Ms8uIJaobMpwRSrtKQM3IPxnJM9f7WTjM-lgdT9L',
      },
    },

    '@sentry/ember': {
      sentry: {
        dsn: null,
        tracesSampleRate: 1.0,
        debug: true,
        autoSessionTracking: true,
        release: `co.houseninja.application@${pkg.version}+1`,
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
    ENV.auth.audience = 'http://localhost:3000';
    ENV.auth.connection = 'development';

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

  if (environment === 'sandbox') {
    ENV.appHost = 'https://sandbox.app.houseninja.co';
    ENV.apiHost = 'https://sandbox.api.houseninja.co';

    ENV.auth.client_id = 'LOOiaA7T7x3V2LP5ZzOx7MdDg4xjJBuh';
    ENV.auth.audience = 'https://sandbox.api.houseninja.co/';
    ENV.auth.connection = 'development';
    ENV.auth.domain = 'sandbox.auth.houseninja.co';

    // Intercom
    ENV.intercom.identityVerificationSecrets = {};

    // Mirage
    ENV['ember-cli-mirage'].enabled = false;

    // Sentry
    ENV['@sentry/ember'].sentry.debug = false;
    ENV['@sentry/ember'].sentry.environment = 'sandbox';
    ENV['@sentry/ember'].sentry.dsn = 'https://4263250e9c344c61bc6033d3a79d822a@o1061437.ingest.sentry.io/6051789';

    // Analytics
    ENV.analytics.mixpanelToken = 'cd20057a467eef665b9e86f0b687a5e3';
  }

  if (environment === 'production') {
    ENV.appHost = 'https://app.houseninja.co';
    ENV.apiHost = 'https://api.houseninja.co';

    ENV.auth.client_id = 'ebbRorM6pQsiFoyUBkzEtSMF2BrdK7Zt';
    ENV.auth.audience = 'https://api.houseninja.co/';
    ENV.auth.connection = 'houseninja';
    ENV.auth.domain = 'auth.houseninja.co';

    // Intercom
    ENV.intercom.identityVerificationSecrets = {};

    // Mirage
    ENV['ember-cli-mirage'].enabled = false;

    // Sentry
    ENV['@sentry/ember'].sentry.debug = false;
    ENV['@sentry/ember'].sentry.environment = 'production';
    ENV['@sentry/ember'].sentry.dsn = 'https://4263250e9c344c61bc6033d3a79d822a@o1061437.ingest.sentry.io/6051789';

    // Analytics
    ENV.analytics.mixpanelToken = 'a114d73d1af6fc278d53462a5c096fe7';
  }

  return ENV;
};
