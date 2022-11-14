import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import ENV from 'houseninja/config/environment';
import { datadogLogs } from '@datadog/browser-logs';
import { arrayItemsInStr } from 'houseninja/utils/array-items-in-str';

export default class DatadogLogs extends BaseAdapter {
  enabled = true;
  excludedEvents: string[] = ['click', 'signup.'];

  toStringExtension(): string {
    return 'DatadogLogs';
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
    datadogLogs.clearUser();
  }

  identify(options: IdentifyOptions): void {
    if (!this.enabled) return;
    const { distinctId, email, name } = options;
    datadogLogs.setUser({
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
    datadogLogs.logger.debug(
      `DEBUG: [metrics] datadog event: ${event}`,
      properties
    );
  }

  trackPage(): void {
    // no-op
  }

  alias(): void {
    // no-op
  }

  reset(): void {
    this.uninstall();
  }

  willDestroy(): void {
    this.reset();
  }
}
