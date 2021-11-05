import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'houseninja/config/environment';

import * as Sentry from '@sentry/capacitor';
import * as SentryEmber from '@sentry/ember';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

const sentryOptions = config['@sentry/ember'].sentry;
const tracingOrigins = config['@sentry/ember'].tracingOrigins;

sentryOptions.environment = config.environment;

Sentry.init(
  {
    ...sentryOptions,
    integrations: [
      new TracingIntegrations.BrowserTracing({
        tracingOrigins,
      }),
    ],
  },
  SentryEmber.init
);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
