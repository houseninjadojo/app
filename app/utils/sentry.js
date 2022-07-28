import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import SentryRRWeb from '@sentry/rrweb';
import config from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { CaptureConsole, ExtraErrorData } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';
import { isPresent } from '@ember/utils';

const { sentry: sentryConfig } = config;

const integrations = () => {
  if (isPresent(sentryConfig.dsn)) {
    return [
      new BrowserTracing(sentryConfig.browserTracingOptions),
      new CaptureConsole({
        levels: ['error', 'warn'],
      }),
      new ExtraErrorData(),
      new SentryRRWeb({
        // @see https://github.com/rrweb-io/rrweb/blob/master/guide.md#options
        // maskInputOptions: {
        //   password: true,
        //   email: true,
        //   tel: true,
        //   // creditCard: true,
        // }
      }),
    ];
  } else {
    return [];
  }
};

const sentryOptions = {
  ...sentryConfig,
  integrations,
};

sentryOptions.environment = config.environment;

export function init() {
  if (isPresent(sentryConfig.dsn)) {
    SentryCapacitor.init(sentryOptions, SentryEmber.init);
  }
}

const Sentry = SentryCapacitor;

export default Sentry;

export function captureException(ex) {
  if (config.environment === 'development') {
    console.error(ex);
  }
  debug(ex);
  Sentry.captureException(ex);
}
