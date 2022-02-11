import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
// import { Integrations as TracingIntegrations } from '@sentry/tracing';
import { BrowserTracing } from '@sentry/tracing';
import config from 'houseninja/config/environment';
import isNativePlatform from 'houseninja/utils/is-native-platform';

const sentryOptions = config['@sentry/ember'].sentry;
const tracingOrigins = config['@sentry/ember'].tracingOrigins;

sentryOptions.environment = config.environment;

export function nativeInit() {
  SentryCapacitor.init(
    {
      ...sentryOptions,
      integrations: [
        new BrowserTracing({
          tracingOrigins,
        }),
      ],
    },
    SentryEmber.init
  );
}

export function webInit() {
  SentryEmber.init({
    ...sentryOptions,
    integrations: [
      new BrowserTracing({
        tracingOrigins,
      }),
    ],
  });
}

export function init() {
  if (isNativePlatform()) {
    nativeInit();
  } else {
    webInit();
  }
}

export default {
  init,
};
