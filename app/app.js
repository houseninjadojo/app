import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'houseninja/config/environment';
import { InitSentryForEmber } from '@sentry/ember';
import { BrowserTracing } from '@sentry/tracing';

const sentryOptions = config['@sentry/ember'].sentry;

InitSentryForEmber({
  ...sentryOptions,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['api.houseninja.co', 'sandbox.api.houseninja.co'],
    }),
  ],
});
// import { init } from 'houseninja/utils/sentry';
// init();

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
