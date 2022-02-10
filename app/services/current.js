import Service, { service } from '@ember/service';
import { get as unstash } from 'houseninja/utils/secure-storage';
import debug from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class CurrentService extends Service {
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
    subscription: null,
  };

  async load() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = await this.store.findRecord('user', user_id, {
        include: 'properties,payment_methods',
      });

      const property = await this.user.properties.get('firstObject');
      this.property = await this.store.findRecord(
        'property',
        property.get('id'),
        { preload: { user: user_id } }
      );

      const paymentMethod = await this.user.paymentMethods.get('firstObject');
      this.paymentMethod = await this.store.findRecord(
        'payment-method',
        paymentMethod.get('id'),
        { preload: { user: user_id } }
      );
    }
  }

  async loadUser() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = await this.store.findRecord('user', user_id, {
        include: 'properties,payment_methods',
      });
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

      device.user = this.user;

      try {
        await device.save();
      } catch (e) {
        debug(e);
        Sentry.captureException(e);
      }
    }
  }
}
