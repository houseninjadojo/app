import * as SentryCapacitor from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import SentryRRWeb from '@sentry/rrweb';
import config from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import {
  CaptureConsole,
  ExtraErrorData,
  RewriteFrames,
} from '@sentry/integrations';
// import { BrowserTracing } from '@sentry/tracing';
import { isPresent } from '@ember/utils';

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
  new RewriteFrames({
    // root path that will be stripped from the current frame's filename by the default iteratee if the filename is an absolute path
    // root: 'app:///co.houseninja.application://',

    // a custom prefix that will be used by the default iteratee (default: `app://`)
    // prefix: 'app:///assets/',

    // function that takes the frame, applies a transformation, and returns it
    iteratee: (frame) => {
      const filename = frame.filename.split('/').pop().replace('?', '');
      frame.filename = `~/assets/${filename}`;
      return frame;
    },
  }),
];

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
