/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: {
    LOG_ACTIVE_GENERATION: boolean;
    LOG_VIEW_LOOKUPS: boolean;
    rootElement: string;
    autoboot: boolean;
  };
  EmberENV: {
    FEATURES: Record<string, unknown>;
    EXTEND_PROTOTYPES: Record<string, unknown>;
  };
  apiHost: string;
  appHost: string;
  appScheme: string;
  auth: {
    audience: string;
    client_id: string;
    connection: string;
    domain: string;
    prompt: string;
    scope: string;
    screen_hint: string;
    useCookiesForTransactions: boolean;
    useRefreshTokens: boolean;
  };
  analytics: {
    mixpanelToken: string;
  };
  branch: {
    key: string;
  };
  datadog: {
    applicationId: string;
    clientToken: string;
    env: string;
    forwardErrorsToLogs: boolean;
    sampleRate: number;
    service: string;
    site: string;
    trackInteractions: boolean;
  };
  'ember-active-storage': {
    url: string;
  };
  'ember-cli-mirage': {
    enabled: boolean;
  };
  intercom: {
    appId: string;
    identityVerificationSecrets: {
      web: string;
      ios: string;
      android: string;
    };
  };
  sentry: {
    dsn: string | undefined;
    tracesSampleRate: number;
    debug: boolean;
    autoSessionTracking: boolean;
    release: string;
    browserTracingOptions: {
      tracingOrigins: string[];
    };
  };
  '@sentry/ember': {
    enabledComponentDefinitions: boolean;
    disablePerformance: boolean;
  };
};

export default config;
