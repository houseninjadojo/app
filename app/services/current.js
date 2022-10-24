import Service, { service } from '@ember/service';
import { get as unstash } from 'houseninja/utils/secure-storage';
import { debug } from '@ember/debug';
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
      Sentry.addBreadcrumb({
        category: 'intercom',
        message: 'load user: not authenticated',
        level: 'info',
      });
      return;
    }
    const userId = this.session?.data?.authenticated?.userinfo?.user_id;
    Sentry.addBreadcrumb({
      category: 'current',
      message: 'load user',
      data: {
        user: { id: userId },
      },
      level: 'info',
    });
    const includes = [
      'invoices',
      'payments',
      'payment_methods',
      'promo_code',
      'properties',
      'properties.work_orders',
      'properties.work_orders.estimate',
      'subscription',
    ];
    this.user = yield this.store.findRecord('user', userId, {
      include: includes.join(','),
    });
    this.paymentMethod = this.user.get('paymentMethods.firstObject');
    this.property = this.user.get('properties.firstObject');
  }

  async loadUser() {
    try {
      await this._loadUser.perform();
    } catch {
      // noop
    }
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

      Sentry.addBreadcrumb({
        category: 'intercom',
        message: 'registering device to user',
        data: {
          user: { id: this.user.id },
          device: { id: device.id },
        },
        level: 'info',
      });

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
    Sentry.addBreadcrumb({
      category: 'current',
      message: 'loading and tracking user',
      data: {
        user: { id, email },
      },
      level: 'info',
    });
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
