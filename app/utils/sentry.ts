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

import type { CapacitorOptions } from '@sentry/capacitor';
import type { Integration } from '@sentry/types';

const { sentry: sentryConfig } = config;

const integrations: Integration[] = [
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
    // function that takes the frame, applies a transformation, and returns it
    iteratee: (frame) => {
      const filename = frame.filename?.split('/').pop()?.replace('?', '');
      frame.filename = `app:///${filename}`;
      return frame;
    },
  }),
];

const sentryOptions = {
  ...sentryConfig,
  integrations,
  environment: config.environment
};

export function init(): void {
  if (isPresent(sentryConfig.dsn)) {
    // @ts-ignore
    SentryCapacitor.init(sentryOptions, SentryEmber.init);
  }
}

const Sentry = SentryCapacitor;

export default Sentry;

export function captureException(ex: Error): void {
  if (config.environment === 'development') {
    console.error(ex);
  }
  debug(ex.message);
  Sentry.captureException(ex);
}
