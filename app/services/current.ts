import Service, { service } from '@ember/service';
import { get as unstash, set as stash } from 'houseninja/utils/secure-storage';
import Sentry, { captureException } from 'houseninja/utils/sentry';
import { task, type Task } from 'ember-concurrency';
import { TrackedObject } from 'tracked-built-ins';
import Device from 'houseninja/models/device';
import { UnauthorizedError } from '@ember-data/adapter/error';
import { debug } from '@ember/debug';
import ENV from 'houseninja/config/environment';
import { getId, getInfo } from 'houseninja/utils/native/device';

import type IntercomService from 'houseninja/services/intercom';
import type MetricsService from 'houseninja/services/metrics';
import type StoreService from '@ember-data/store';
import type SessionService from 'houseninja/services/session';
import type User from 'houseninja/models/user';
import type PaymentMethod from 'houseninja/models/payment-method';
import type Property from 'houseninja/models/property';

export default class CurrentService extends Service {
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare store: StoreService;
  @service declare session: SessionService;

  isLoadingUser = false;

  user?: User;
  device?: Device;
  pushTokens?: { apnsDeviceToken?: string; fcmToken?: string };

  signup = new TrackedObject({
    zipcode: null,
    selectedPlan: null,
    contactInfo: {},
    subscription: null,
  });

  // eslint-disable-next-line prettier/prettier
  async setDeviceTokens(tokens: { apns?: string; fcm?: string }): Promise<void> {
    const { apns, fcm } = tokens;
    this.pushTokens = { apnsDeviceToken: apns, fcmToken: fcm };
    await stash('pushToken', this.pushTokens);
    if (this.device instanceof Device) {
      this.device.setProperties(this.pushTokens);
      await this.device.save();
    }
  }

  _loadUser: Task<void, []> = task(this, { drop: true }, async () => {
    if (!this.session.data?.authenticated?.userinfo) {
      return;
    }
    const userId = this.session.data.authenticated.userinfo.user_id;
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
      let device = this.store.peekAll('device').get('firstObject');
      if (!device) {
        const stashedDevice = await unstash('device');
        device = this.store.createRecord('device', {
          stashedDevice,
        });
      }
      Sentry.addBreadcrumb({
        type: 'info',
        category: 'device.register',
        message: 'registering device to user',
        data: {
          user: { id: this.user?.id },
          device: { id: device.id },
        },
      });
      device.user = this.user;
      device.setProperties(this.pushTokens);
      try {
        await device.save();
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          debug('[device] not authorized to register this device');
        } else {
          captureException(e as Error);
        }
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
      this.user.identifyToMetrics();
      this.isLoadingUser = false;
    }
  });

  async syncDevice(): Promise<void> {
    if (ENV.environment === 'test') return;
    const device_id = await getId();
    const info = await getInfo();
    const pushToken = await unstash('pushToken');
    const deviceInfo = {
      ...info,
      ...pushToken,
      deviceId: device_id,
    };
    debug(`[device] initializing device id=${device_id}`);
    try {
      let device;
      // check if we know about the device already
      const devices = await this.store.query('device', {
        filter: {
          device_id,
        },
      });
      if (devices.length > 0) {
        // we know about this device, so update any changes
        device = devices.firstObject;
        device.setProperties(deviceInfo);
      } else {
        // this is a new device, so create it
        device = this.store.createRecord('device', deviceInfo);
      }
      await device.save();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        debug('[device] unauthorized, skipping device registration');
      } else {
        captureException(e as Error);
      }
    }
    await stash('device', deviceInfo);
    this.device = deviceInfo;
  }
}
