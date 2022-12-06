import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'houseninja/config/environment';
import { Intercom } from '@houseninja/capacitor-intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { initializeTelemetry } from 'houseninja/services/telemetry';

// telemetry
initializeTelemetry();

export default class App extends Application {
  constructor(properties: object | undefined) {
    super(properties);
    if (isNativePlatform()) {
      Intercom.disableMessengerPopups();
      Intercom.disableLauncher();
    }
  }
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
