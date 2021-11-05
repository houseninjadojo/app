import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { run } from '@ember/runloop';

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  client = window.mixpanel;

  async setup() {
    await run(async () => {
      try {
        await this.client.init(
          ENV.analytics.mixpanelToken,
          this._debug,
          this._debug
        );
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async track(event, properties) {
    await run(async () => {
      try {
        await this.client.track(event, properties);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async identify(id) {
    await run(async () => {
      try {
        // A bug requires us to pass fake callbacks
        await this.client.identify(id, true, this._debug, this._debug);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async alias(id) {
    await run(async () => {
      try {
        await this.client.alias(id);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async registerSuperProperties(properties = {}) {
    await run(async () => {
      try {
        await this.client.registerSuperProperties(properties);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async reset() {
    await run(async () => {
      try {
        await this.client.reset();
      } catch (e) {
        this._debug(e);
      }
    });
  }

  // MUST BE CALLED BEFORE `#identify`
  async setProfile(profile = {}) {
    await run(async () => {
      try {
        await this.client.people.set(profile);
      } catch (e) {
        this._debug(e);
      }
    });
  }

  async trackCharge(amount, options = {}) {
    await run(async () => {
      try {
        await this.client.people.trackCharge(
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
