import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import SentryRRWeb from '@sentry/rrweb';
import config from 'houseninja/config/environment';
import { CaptureConsole, ExtraErrorData } from '@sentry/integrations';
import { isPresent } from '@ember/utils';

import RewriteFrames from './sentry/rewrite-frames';

const { sentry: sentryConfig } = config;

const integrations = [
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
  RewriteFrames,
];

const sentryOptions = {
  ...sentryConfig,
  integrations,
  environment: config.environment,
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

// export function captureException(ex) {
//   if (config.environment === 'development') {
//     console.error(ex);
//   }
//   debug(ex);
//   Sentry.captureException(ex);
// }
