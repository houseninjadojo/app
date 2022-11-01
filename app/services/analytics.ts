import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug, deprecate } from '@ember/debug';
import { run } from '@ember/runloop';
import { Mixpanel } from '@houseninja/capacitor-mixpanel';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import Sentry from 'houseninja/utils/sentry';

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  async setup() {
    deprecate('AnalyticsService.setup is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (!isNativePlatform() && ENV.environment !== 'test') {
      const token = ENV.analytics.mixpanelToken;
      const options = {
        token,
        autotrack: true,
        debug: false,
      };
      try {
        await Mixpanel.initialize(options);
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    }
  }

  async track(event: string, properties: object = {}) {
    deprecate('AnalyticsService.track is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.track({ event, properties });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async identify(distinctId: string) {
    deprecate('AnalyticsService.identify is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      Sentry.addBreadcrumb({
        type: 'info',
        category: 'analytics',
        message: 'identifying user',
        data: {
          user: { id: distinctId },
        },
      });
      try {
        Mixpanel.identify({ distinctId });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async alias(alias: string, distinctId: string) {
    deprecate('AnalyticsService.alias is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.alias({ alias, distinctId });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async registerSuperProperties(properties = {}) {
    deprecate('AnalyticsService.registerSuperProperties is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.registerSuperProperties({ properties });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async reset() {
    deprecate('AnalyticsService.reset is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.reset();
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async setProfile(properties = {}) {
    deprecate('AnalyticsService.setProfile is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.setProfile({ properties });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  async trackCharge(amount: number, properties = {}) {
    deprecate('AnalyticsService.trackCharge is deprecated', false, {
      id: 'service.analytics.use-metrics',
      for: 'houseninja',
      until: '1.25.0',
      since: {
        available: '1.24.9',
      },
    });
    if (this._shouldNotExecute()) {
      return;
    }
    await run(async () => {
      try {
        Mixpanel.trackCharge({ amount, properties });
      } catch (e: unknown) {
        this._debug(e as Error);
      }
    });
  }

  _debug(e: Error) {
    debug(`AnalyticsService - ${e}`);
  }

  _shouldNotExecute() {
    // @todo why did I have this not run if native?
    // return ENV.environment === 'test' || isNativePlatform();
    return ENV.environment === 'test';
  }
}
