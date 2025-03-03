'use strict';

require('dotenv-vault-core').config();

const pkg = require('../package.json');

module.exports = function (environment) {
  const env = process.env.ENV || environment || 'development';

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
        // Array: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    env,

    apiHost: process.env.API_HOST,
    appHost: process.env.APP_HOST,
    appScheme: process.env.APP_SCHEME,

    /**
     * Auth0 Config
     * @see https://auth0.github.io/auth0-spa-js/interfaces/auth0clientoptions.html
     */
    auth: {
      audience: process.env.AUTH_AUDIENCE,
      client_id: process.env.AUTH_CLIENT_ID,
      connection: process.env.AUTH_CONNECTION,
      // display: 'touch',
      domain: process.env.AUTH_DOMAIN,
      // login_hint: 'user@email.com',
      prompt: 'none',
      scope: 'openid profile email',
      screen_hint: 'login',
      useCookiesForTransactions: false,
      useRefreshTokens: true,
    },

    analytics: {
      mixpanelToken: process.env.MIXPANEL_TOKEN,
    },

    branch: {
      key: process.env.BRANCH_KEY,
    },

    datadog: {
      applicationId: process.env.DATADOG_RUM_APP_ID,
      clientToken: process.env.DATADOG_CLIENT_TOKEN,
      env,
      side: 'datadoghq.com',
      service: 'app',
      version: pkg.version,
    },

    'ember-active-storage': {
      url: process.env.API_ACTIVE_STORAGE_HOST,
    },

    'ember-cli-mirage': {
      enabled: false,
      useDefaultPassthroughs: false,
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

    metricsAdapters: [
      {
        name: 'CapacitorIntercom',
        environments: ['development', 'sandbox', 'production'],
        config: {
          appId: process.env.INTERCOM_APP_ID,
        }
      },
      {
        name: 'CapacitorMixpanel',
        environments: ['sandbox', 'production'],
        config: {
          token: process.env.MIXPANEL_TOKEN,
        },
      },
      {
        name: 'DatadogRum',
        environments: ['sandbox', 'production'],
        config: {},
      },
      {
        name: 'DatadogLogs',
        environments: ['sandbox', 'production'],
        config: {},
      },
    ],

    sentry: {
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.0,
      debug: false,
      env,
      autoSessionTracking: true,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 0.0,
      release: `co.houseninja.application@${pkg.version}+1`,
      browserTracingOptions: {
        tracingOrigins: [
          'api.houseninja.co',
          'sandbox.api.houseninja.co',
        ],
      }
    },

    '@sentry/ember': {
      enableComponentDefinition: true,
      disablePerformance: false,
    },
  };

  if (env === 'development') {
    // Sentry
    ENV.sentry.debug = true;

    // Mirage
    ENV['ember-cli-mirage'].enabled = true;

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (env === 'test') {
    // Mirage
    ENV['ember-cli-mirage'].enabled = true;

    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (env === 'sandbox') {
    // Sentry
    ENV.sentry.environment = 'sandbox';
    ENV.sentry.tracesSampleRate = 1.0;
    ENV.sentry.replaysSessionSampleRate = 1.0;
    ENV.sentry.replaysOnErrorSampleRate = 1.0;

    // Mirage
    ENV['ember-cli-mirage'].excludeFilesFromBuild = true;
  }

  if (env === 'production') {
    // Sentry
    ENV.sentry.environment = 'production';
    ENV.sentry.tracesSampleRate = 1.0;
    ENV.sentry.replaysSessionSampleRate = 1.0;
    ENV.sentry.replaysOnErrorSampleRate = 1.0;

    // Mirage
    ENV['ember-cli-mirage'].excludeFilesFromBuild = true;
  }

  return ENV;
};
