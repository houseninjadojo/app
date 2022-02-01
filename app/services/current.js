import Service, { service } from '@ember/service';
import { task, taskGroup } from 'ember-concurrency';
import { get as unstash } from 'houseninja/utils/secure-storage';
import debug from '@ember/debug';
import { isEmpty } from '@ember/utils';
import * as Sentry from '@sentry/ember';

export default class CurrentService extends Service {
  @taskGroup({
    drop: true,
    maxConcurrency: 1, // change this to the number of loader tasks
  })
  loaders;

  @service store;
  @service session;

  user = null;
  // properties = [];
  property = null;
  device = null;
  paymentMethod = null;

  signup = {
    zipcode: null,
    selectedPlan: null,
    contactInfo: {},
  };

  load() {
    return this._load.perform();
  }

  registerDeviceToUser() {
    return this._registerDeviceToUser.perform();
  }

  loadPaymentMethod() {
    return this._loadPaymentMethod();
  }

  @task({ drop: true }) *_load() {
    yield this.loadUser.perform();
    yield this.loadProperty.perform();
    yield this.loadPaymentMethod.perform();
  }

  @task({ drop: true }) *loadUser() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = yield this.store.findRecord('user', user_id, {
        include: 'properties,properties.address,payment-methods',
      });
    }
  }

  @task({ drop: true }) *loadProperty() {
    if (this.session.isAuthenticated) {
      if (isEmpty(this.user)) {
        yield this.loadUser.perform();
      }
      const property = yield this.user.properties.get('firstObject');
      this.property = yield this.store.findRecord(
        'property',
        property.get('id'),
        { preload: { user: this.user.get('id') } }
      );
    }
  }

  // @todo
  // why are we doing this again?
  @task({ drop: true }) *_loadPaymentMethod() {
    if (this.session.isAuthenticated) {
      if (isEmpty(this.user)) {
        yield this.loadUser.perform();
      }
      const paymentMethod = yield this.user.paymentMethods.get('firstObject');
      this.paymentMethod = yield this.store.findRecord(
        'payment-method',
        paymentMethod.get('id'),
        { preload: { user: this.user.get('id') } }
      );
    }
  }

  @task({ drop: true }) *_registerDeviceToUser() {
    if (this.session.isAuthenticated) {
      if (isEmpty(this.user)) {
        yield this.loadUser.perform();
      }

      let device = this.store.peekAll('device').get('firstObject');
      if (!device) {
        let stashedDevice = yield unstash('device');
        device = this.store.createRecord('device', {
          ...stashedDevice.value,
        });
      }

      device.user = this.user;

      try {
        yield device.save();
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
