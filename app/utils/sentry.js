import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import config from 'houseninja/config/environment';
// import isNativePlatform from 'houseninja/utils/is-native-platform';
import { debug } from '@ember/debug';
import { CaptureConsole, ExtraErrorData } from '@sentry/integrations';

const sentryOptions = {
  ...config.sentry,
  integrations: [new CaptureConsole(), new ExtraErrorData()],
};

sentryOptions.environment = config.environment;

export function nativeInit() {
  SentryCapacitor.init(sentryOptions, SentryEmber.init);
}

export function webInit() {
  SentryEmber.init();
}

export function init() {
  // if (isNativePlatform()) {
  nativeInit();
  // } else {
  //   webInit();
  // }
}

// const Sentry = isNativePlatform() ? SentryCapacitor : SentryEmber;
const Sentry = SentryCapacitor;

export default Sentry;

export function captureException(ex) {
  if (config.environment === 'development') {
    console.error(ex);
  }
  debug(ex);
  Sentry.captureException(ex);
}
