import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { task, taskGroup } from 'ember-concurrency';

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  client = window.mixpanel;

  track(event, properties) {
    return this._track.perform(event, properties);
  }

  identify(id) {
    return this._identify.perform(id);
  }

  setProfile(profile = {}) {
    return this._setProfile.perform(profile);
  }

  @taskGroup({ enqueue: true }) throttle;

  @task({ group: 'throttle' }) *setup() {
    try {
      yield this.client.init(
        ENV.analytics.mixpanelToken,
        this._debug,
        this._debug
      );
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *_track(event, properties) {
    try {
      yield this.client.track(event, properties);
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *_identify(id) {
    try {
      // A bug requires us to pass fake callbacks
      yield this.client.identify(id, true, this._debug, this._debug);
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *alias(id) {
    try {
      yield this.client.alias(id);
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *registerSuperProperties(properties = {}) {
    try {
      yield this.client.registerSuperProperties(properties);
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *reset() {
    try {
      yield this.client.reset();
    } catch (e) {
      this._debug(e);
    }
  }

  // MUST BE CALLED BEFORE `#identify`
  @task({ group: 'throttle' }) *_setProfile(profile = {}) {
    try {
      yield this.client.people.set(profile);
    } catch (e) {
      this._debug(e);
    }
  }

  @task({ group: 'throttle' }) *trackCharge(amount, options = {}) {
    try {
      yield this.client.people.trackCharge(
        amount,
        options,
        this._debug,
        this._debug
      );
    } catch (e) {
      this._debug(e);
    }
  }

  _debug(e) {
    debug(`AnalyticsService - ${e}`);
  }
}
