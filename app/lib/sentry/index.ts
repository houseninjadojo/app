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
