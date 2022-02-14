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
        await Mixpanel.init({ token });
        window.mixpanel.init(token);
      } catch (e) {
        this._debug(e);
      }
    }
  }

  async track(event, properties) {
    await run(async () => {
      try {
        await Mixpanel.track({ event, properties });
        window.mixpanel.track(event, properties);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async identify(distinctId) {
    await run(async () => {
      try {
        await Mixpanel.identify({ distinctId });
        window.mixpanel.identify(distinctId);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async alias(alias, distinctId) {
    await run(async () => {
      try {
        await Mixpanel.alias({ alias, distinctId });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async registerSuperProperties(properties = {}) {
    await run(async () => {
      try {
        await Mixpanel.registerSuperProperties({ properties });
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async reset() {
    await run(async () => {
      try {
        await Mixpanel.reset();
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async setProfile(profile = {}) {
    await run(async () => {
      try {
        await Mixpanel.people.set(profile);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async trackCharge(amount, options = {}) {
    await run(async () => {
      try {
        await Mixpanel.people.trackCharge(
          amount,
          options,
          this._debug,
          this._debug
        );
      } catch (e) {
        this._debug(e);
      }
    });
  }

  _debug(e) {
    debug(`AnalyticsService - ${e}`);
  }
}
