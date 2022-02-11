import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import { InitSentryForEmber } from '@sentry/ember';
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
  console.log('Init');
  InitSentryForEmber({
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

const Sentry = isNativePlatform() ? SentryCapacitor : SentryEmber;

export default Sentry;
