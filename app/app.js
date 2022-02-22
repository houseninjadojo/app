import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'houseninja/config/environment';
import { init } from 'houseninja/utils/sentry';
import { Intercom } from '@capacitor-community/intercom';
// init sentry
init();

export default class App extends Application {
  constructor() {
    super(...arguments);
    Intercom.hideInAppMessages();
  }
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
