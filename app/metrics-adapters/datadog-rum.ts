import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import ENV from 'houseninja/config/environment';
import { datadogRum } from '@datadog/browser-rum';
import arrayItemsInStr from 'houseninja/utils/array-items-in-str';

export default class DatadogRum extends BaseAdapter {
  enabled = true;
  excludedEvents: string[] = ['click.', 'signup.'];

  toStringExtension(): string {
    return 'DatadogRum';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init(): void {
    if (ENV.environment === 'test') {
      this.enabled = false;
    }
  }

  install(): void {
    // no-op
  }

  uninstall(): void {
    if (!this.enabled) return;
    datadogRum.clearUser();
  }

  identify(options: IdentifyOptions): void {
    if (!this.enabled) return;
    const { distinctId, email, name } = options;
    datadogRum.setUser({
      id: distinctId,
      email,
      name,
    });
  }

  trackEvent(options: {
    event: string;
    properties?: Record<string, unknown>;
  }): void {
    if (!this.enabled) return;
    const { event, properties } = options;
    if (arrayItemsInStr(this.excludedEvents, event)) return;
    datadogRum.addAction(event, properties);
  }

  trackPage(): void {
    // no-op
  }

  alias(): void {
    // no-op
  }

  willDestroy(): void {
    if (!this.enabled) return;
    datadogRum.clearUser();
  }
}
