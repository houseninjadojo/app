import Service, { service } from '@ember/service';
import { get as unstash } from 'houseninja/utils/secure-storage';
import { debug } from '@ember/debug';
import Sentry, { captureException } from 'houseninja/utils/sentry';
import { task, type Task } from 'ember-concurrency';
import AnalyticsService from 'houseninja/services/analytics';
import IntercomService from 'houseninja/services/intercom';
import type StoreService from '@ember-data/store';
import type Device from 'houseninja/models/device';
import type User from 'houseninja/models/user';
import type PaymentMethod from 'houseninja/models/payment-method';
import type Property from 'houseninja/models/property';
import type SessionService from './session';

export default class CurrentService extends Service {
  @service declare analytics: AnalyticsService;
  @service declare intercom: IntercomService;
  @service declare store: StoreService;
  @service declare session: SessionService;

  isLoadingUser = false;

  user?: User;
  device?: Device;

  signup = {
    zipcode: null,
    selectedPlan: null,
    contactInfo: {},
    subscription: null,
  };

  _loadUser: Task<void, []> = task(this, { drop: true }, async () => {
    if (!this.session.isAuthenticated) { return; } // eslint-disable-line
    const userId = this.session?.data?.authenticated?.userinfo?.user_id;
    if (!userId) { return; } // eslint-disable-line
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
    this.user = await this.store.findRecord('user', userId, {
      include: includes.join(','),
    });
  });

  get paymentMethod(): PaymentMethod | undefined {
    if (this.user && this.user.paymentMethods.length) {
      return this.user.paymentMethods.firstObject;
    } else {
      return undefined;
    }
  }

  get property(): Property | undefined {
    if (this.user && this.user.properties.length) {
      return this.user.properties.firstObject;
    } else {
      return undefined;
    }
  }

  async loadUser(): Promise<void> {
    await this._loadUser.perform();
  }

  async registerDeviceToUser(): Promise<void> {
    if (this.session.isAuthenticated) {
      if (!this.user) {
        await this.loadUser();
      }

      let device = await this.store.peekAll('device').get('firstObject');
      if (!device) {
        const stashedDevice = await unstash('device');
        device = this.store.createRecord('device', {
          stashedDevice,
        });
      }

      Sentry.addBreadcrumb({
        category: 'intercom',
        message: 'registering device to user',
        data: {
          user: { id: this.user?.id },
          device: { id: device.id },
        },
        level: 'info',
      });

      device.user = this.user;

      try {
        await device.save();
      } catch (e: unknown) {
        debug(e as string);
        captureException(e as Error);
      }
    }
  }

  // prettier-ignore
  loadIdentifyAndTrack: Task<void, []> = task(this, { drop: true }, async () => {
    this.isLoadingUser = true;
    if (!this.session.isAuthenticated) {
      this.isLoadingUser = false;
      return;
    }
    await this._loadUser.perform();
    await this.registerDeviceToUser();
    if (this.user) {
      const { id, intercomHash, email, fullName } = this.user.getProperties(
        'id',
        'intercomHash',
        'email',
        'fullName'
      );
      Sentry.addBreadcrumb({
        category: 'current',
        message: 'loading and tracking user',
        data: { user: { id, email } },
        level: 'info',
      });
      Sentry.setUser({ email });
      await this.analytics.identify(email);
      await this.analytics.setProfile({
        $email: email,
        $name: fullName,
      });
      await this.intercom.registerUser(id, email, intercomHash as string);
      this.isLoadingUser = false;
    }
  });
}
