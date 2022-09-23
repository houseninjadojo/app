import Service from '@ember/service';
import ENV from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import { Mixpanel } from '@houseninja/capacitor-mixpanel';
import isNativePlatform from 'houseninja/utils/is-native-platform';

type UnionToIntersectionHelper<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type MPMethod = keyof typeof Mixpanel;
type MPMPayload = UnionToIntersectionHelper<
  Exclude<Parameters<typeof Mixpanel[keyof typeof Mixpanel]>[0], undefined>
>;

type MMPP<T extends MPMethod> = Exclude<
  Parameters<typeof Mixpanel[T]>[0],
  undefined
>;

// https://github.com/samzilverberg/cordova-mixpanel-plugin/blob/master/typings/mixpanel.d.ts
export default class AnalyticsService extends Service {
  private execMixpanelMethod(
    method: MPMethod,
    payload?: MMPP<typeof method>
  ): void {
    if (this.shouldNotExecute) {
      return;
    }
    const execMethod = () => {
      try {
        Mixpanel[method](payload as MPMPayload);
      } catch (e: unknown) {
        this.debug(e as Error);
      }
    };
    scheduleOnce('afterRender', this, execMethod);
  }

  setup(): void {
    if (isNativePlatform()) {
      return; // only run this on web
    }
    const payload = {
      token: ENV.analytics.mixpanelToken,
      autotrack: true,
      debug: false,
    };
    this.execMixpanelMethod('initialize', payload);
  }

  track(event: string, properties: object = {}): void {
    this.execMixpanelMethod('track', { event, properties });
  }

  identify(distinctId: string): void {
    this.execMixpanelMethod('identify', { distinctId });
  }

  alias(alias: string, distinctId: string): void {
    this.execMixpanelMethod('alias', { alias, distinctId });
  }

  registerSuperProperties(properties = {}): void {
    this.execMixpanelMethod('registerSuperProperties', { properties });
  }

  reset(): void {
    this.execMixpanelMethod('reset');
  }

  setProfile(properties = {}): void {
    this.execMixpanelMethod('setProfile', { properties });
  }

  trackCharge(amount: number, properties = {}): void {
    this.execMixpanelMethod('trackCharge', { amount, properties });
  }

  private debug(e: Error): void {
    debug(`AnalyticsService - ${e}`);
  }

  private get shouldNotExecute(): boolean {
    // @todo why did I have this not run if native?
    // return ENV.environment === 'test' || isNativePlatform();
    return ENV.environment === 'test';
  }
}
