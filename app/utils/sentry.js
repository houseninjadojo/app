import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import config from 'houseninja/config/environment';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { debug } from '@ember/debug';

const sentryOptions = config['@sentry/ember'].sentry;

sentryOptions.environment = config.environment;

export function nativeInit() {
  SentryCapacitor.init(sentryOptions, SentryEmber.init);
}

export function webInit() {
  SentryEmber.init();
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

export function captureException(ex) {
  debug(ex);
  Sentry.captureException(ex);
}
