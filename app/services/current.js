import Service, { service } from '@ember/service';
import { get as unstash } from 'houseninja/utils/secure-storage';
import debug from '@ember/debug';
import Sentry from 'houseninja/utils/sentry';
import { task } from 'ember-concurrency';

export default class CurrentService extends Service {
  @service analytics;
  @service intercom;
  @service store;
  @service session;

  isLoadingUser = false;

  user = null;
  // properties = [];
  property = null;
  device = null;
  paymentMethod = null;

  signup = {
    zipcode: null,
    selectedPlan: null,
    contactInfo: {},
    subscription: null,
  };

  @task({ drop: true }) *_loadUser() {
    if (!this.session.isAuthenticated) {
      return;
    }
    const { user_id } = this.session.data.authenticated.userinfo;
    const includes = [
      'invoices',
      'payments',
      'payment_methods',
      'properties',
      'properties.work_orders',
    ];
    this.user = yield this.store.findRecord('user', user_id, {
      include: includes.join(','),
    });
    this.paymentMethod = this.user.get('paymentMethods.firstObject');
    this.property = this.user.get('properties.firstObject');
  }

  async loadUser() {
    await this._loadUser.perform();
  }

  async registerDeviceToUser() {
    if (this.session.isAuthenticated) {
      if (!this.user) {
        await this.loadUser();
      }

      let device = this.store.peekAll('device').get('firstObject');
      if (!device) {
        let stashedDevice = await unstash('device');
        device = this.store.createRecord('device', {
          ...stashedDevice.value,
        });
      }

      device.user = this.user;

      try {
        await device.save();
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }

  @task *loadIdentifyAndTrack() {
    this.isLoadingUser = true;
    if (!this.session.isAuthenticated) {
      this.isLoadingUser = false;
      return;
    }
    yield this._loadUser.perform();
    yield this.registerDeviceToUser();
    const { id, intercomHash, email, fullName } = this.user.getProperties(
      'id',
      'intercomHash',
      'email',
      'fullName'
    );
    Sentry.setUser({ email });
    yield this.analytics.identify(email);
    yield this.analytics.setProfile({
      $email: email,
      $name: fullName,
    });
    yield this.intercom.registerUser(id, email, intercomHash);
    this.isLoadingUser = false;
  }
}
