import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import { Mixpanel } from '@houseninja/capacitor-mixpanel';
import { assert } from '@ember/debug';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { isPresent } from '@ember/utils';
import { captureException } from 'houseninja/utils/sentry';
import ENV from 'houseninja/config/environment';

export default class CapacitorMixpanel extends BaseAdapter {
  toStringExtension(): string {
    return 'CapacitorMixpanel';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init(): void {
    if (ENV.environment === 'test') return;
    this.install();
  }

  install(): void {
    const { token } = this.config;
    if (!token) return;
    assert(
      `[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`,
      token
    );
    // only initialize if we are on the web
    if (!isNativePlatform()) {
      try {
        Mixpanel.initialize({ token, autotrack: true, debug: false });
      } catch (e) {
        captureException(e as Error);
      }
    }
  }

  identify(options: IdentifyOptions): void {
    const { distinctId, email, name } = options;
    try {
      Mixpanel.identify({ distinctId });
    } catch (e) {
      captureException(e as Error);
    }
    if (isPresent(email) || isPresent(name)) {
      this.setProfile({ properties: { $email: email, $name: name } });
    }
  }

  trackEvent(options: { event: string; properties: object }): void {
    const { event, properties } = options;
    try {
      Mixpanel.track({ event, properties });
    } catch (e) {
      captureException(e as Error);
    }
  }

  trackPage(properties: { page: string; title: string }): void {
    try {
      Mixpanel.track({ event: 'Page Visit', properties });
    } catch (e) {
      captureException(e as Error);
    }
  }

  alias(options: { alias: string; distinctId: string }): void {
    const { alias, distinctId } = options;
    try {
      Mixpanel.alias({ alias, distinctId });
    } catch (e) {
      captureException(e as Error);
    }
  }

  setProfile(options: { properties: object }): void {
    const { properties } = options;
    try {
      Mixpanel.setProfile({ properties });
    } catch (e) {
      captureException(e as Error);
    }
  }

  reset(): void {
    try {
      Mixpanel.reset();
    } catch (e) {
      captureException(e as Error);
    }
  }

  uninstall(): void {
    this.reset();
  }

  willDestroy(): void {
    this.uninstall();
  }
}
