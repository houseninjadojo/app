import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import config from 'houseninja/config/environment';
import { isPresent } from '@ember/utils';

import integrations from './integrations';

const { sentry: sentryConfig } = config;

const sentryOptions = {
  ...sentryConfig,
  integrations,
  environment: config.environment,
  denyUrls: [
    /localhost/,
    /127\.0\.0\.1/,
    /api2\.branch\.io/,
    /browser-intake-datadoghq\.com/,
  ],
  ignoreErrors: [
    /DEPRECATION/,
    /Error in API: 0/,
    /window.Intercom is not a function/,
    /BranchDeepLinks/,
    /Capacitor WebPlugin/,
    /Cannot read properties of undefined (reading 'disable_all_events')/,
    /Illegal invocation/,
    /Not implemented on web\./,
  ],
};

export function init() {
  if (isPresent(sentryConfig.dsn)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    SentryCapacitor.init(sentryOptions, SentryEmber.init);
  }
}

const Sentry = SentryCapacitor;

export default Sentry;
