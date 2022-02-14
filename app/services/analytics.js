import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { run } from '@ember/runloop';
import { Mixpanel } from '@houseninja/capacitor-mixpanel';
import isNativePlatform from 'houseninja/utils/is-native-platform';

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  async setup() {
    if (!isNativePlatform()) {
      try {
        const token = ENV.analytics.mixpanelToken;
        await Mixpanel.initialize({ token });
      } catch (e) {
        this._debug(e);
      }
    }
  }

  async track(event, properties) {
    await run(async () => {
      try {
        Mixpanel.track({ event, properties });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async identify(distinctId) {
    await run(async () => {
      try {
        Mixpanel.identify({ distinctId });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async alias(alias, distinctId) {
    await run(async () => {
      try {
        Mixpanel.alias({ alias, distinctId });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async registerSuperProperties(properties = {}) {
    await run(async () => {
      try {
        Mixpanel.registerSuperProperties({ properties });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async reset() {
    await run(async () => {
      try {
        Mixpanel.reset();
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async setProfile(properties = {}) {
    await run(async () => {
      try {
        Mixpanel.setProfile({ properties });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async trackCharge(amount, properties = {}) {
    await run(async () => {
      try {
        Mixpanel.trackCharge({ amount, properties });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  _debug(e) {
    debug(`AnalyticsService - ${e}`);
  }
}
