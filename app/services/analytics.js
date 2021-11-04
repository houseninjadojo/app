import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug } from '@ember/debug';

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  client = window.mixpanel;

  async setup() {
    try {
      await this.client.init(ENV.analytics.mixpanelToken);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async track(event, properties) {
    try {
      await this.client.track(event, properties);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async identify(id) {
    try {
      await this.client.identify(id, true);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async alias(id) {
    try {
      await this.client.alias(id);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async registerSuperProperties(properties = {}) {
    try {
      await this.client.registerSuperProperties(properties);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async reset() {
    try {
      await this.client.reset();
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  // MUST BE CALLED BEFORE `#identify`
  async setProfile(profile = {}) {
    try {
      await this.client.people.set(profile);
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }

  async trackCharge(amount, options = {}) {
    try {
      await this.client.people.trackCharge(
        amount,
        options,
        console.log,
        console.log
      );
    } catch (e) {
      debug(`AnalyticsService: ` + e);
    }
  }
}
