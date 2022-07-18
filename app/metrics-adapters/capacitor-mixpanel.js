import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { Mixpanel } from '@houseninja/capacitor-mixpanel';
import { run } from '@ember/runloop';
import { assert, debug } from '@ember/debug';
import { isPresent } from '@ember/utils';

export default class CapacitorMixpanel extends BaseAdapter {
  toStringExtension() {
    return 'CapacitorMixpanel';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    this.install();
  }

  install() {
    const { token } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`,
      token
    );

    // only initialize if we are on the web
    if (!isNativePlatform()) {
      try {
        Mixpanel.initialize({ token });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#install: ${e}`);
      }
    }
  }

  identify(options = {}) {
    const { distinctId, profile } = options;
    run(async () => {
      try {
        Mixpanel.identify({ distinctId });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#identify: ${e}`);
      }
    });
    if (isPresent(profile)) {
      this.setProfile({ properties: profile });
    }
  }

  trackEvent(options = {}) {
    const { event, properties } = options;
    run(async () => {
      try {
        Mixpanel.track({ event, properties });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#trackEvent: ${e}`);
      }
    });
  }

  trackPage(options = {}) {
    const { page, title } = options;
    const properties = { page, title };
    run(async () => {
      try {
        Mixpanel.track({ event: 'Page Visit', properties });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#trackPage: ${e}`);
      }
    });
  }

  alias(options = {}) {
    const { alias, distinctId } = options;
    run(async () => {
      try {
        Mixpanel.alias({ alias, distinctId });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#alias: ${e}`);
      }
    });
  }

  setProfile(options = {}) {
    const { properties } = options;
    run(async () => {
      try {
        Mixpanel.setProfile({ properties });
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#setProfile: ${e}`);
      }
    });
  }

  uninstall() {
    run(async () => {
      try {
        Mixpanel.reset();
      } catch (e) {
        debug(`[ember-metrics] error - CapacitorMixpanel#uninstall: ${e}`);
      }
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.uninstall();
  }
}
