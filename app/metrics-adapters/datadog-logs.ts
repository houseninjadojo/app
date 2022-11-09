import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import ENV from 'houseninja/config/environment';
import { datadogLogs } from '@datadog/browser-logs';

export default class DatadogLogs extends BaseAdapter {
  enabled = true;

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
    datadogLogs.logger.debug(
      `[metrics] \`datadog\` event: ${event}`,
      properties
    );
  }

  trackPage(): void {
    // no-op
  }

  alias(): void {
    // no-op
  }

  willDestroy(): void {
    if (!this.enabled) return;
    datadogLogs.clearUser();
  }
}
