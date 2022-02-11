import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import config from 'houseninja/config/environment';
import isNativePlatform from 'houseninja/utils/is-native-platform';

const sentryOptions = config['@sentry/ember'].sentry;

sentryOptions.environment = config.environment;

export function nativeInit() {
  SentryCapacitor.init(sentryOptions, SentryEmber.init);
}

export function webInit() {
  SentryEmber.init(sentryOptions);
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
