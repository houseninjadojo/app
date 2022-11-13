import { SeverityLevel } from '@sentry/browser';
import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import ENV from 'houseninja/config/environment';
import arrayItemsInStr from 'houseninja/utils/array-items-in-str';
import {
  default as SentryInstance,
  addBreadcrumb,
} from 'houseninja/utils/sentry';

type BreadcrumbOptions = {
  type?: string;
  category?: string;
  message?: string;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  level?: SeverityLevel;
};

export default class Sentry extends BaseAdapter {
  enabled = true;
  excludedEvents: string[] = ['click.', 'signup.'];

  toStringExtension(): string {
    return 'Sentry';
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
    SentryInstance.setUser(null);
  }

  identify(options: IdentifyOptions): void {
    if (!this.enabled) return;
    const { distinctId, email } = options;
    SentryInstance.setUser({ id: distinctId, email });
    this.addBreadcrumb({
      type: 'user',
      category: 'user.identify',
      message: 'loading and tracking user',
      data: { user: { id: distinctId, email } },
    });
  }

  trackEvent(options: {
    event: string;
    properties?: Record<string, unknown>;
    breadcrumb?: Record<string, unknown>;
  }): void {
    if (!this.enabled) return;
    const { event, properties, breadcrumb } = options;
    if (arrayItemsInStr(this.excludedEvents, event)) return;
    if (!breadcrumb) return;
    this.addBreadcrumb({
      ...breadcrumb,
      category: event,
      data: properties,
    });
  }

  trackPage(): void {
    // no-op
  }

  alias(): void {
    // no-op
  }

  addBreadcrumb(options: BreadcrumbOptions): void {
    const { type, category, message, data, level } = options;
    addBreadcrumb(category, message, data, type, level);
  }

  reset(): void {
    this.uninstall();
  }

  willDestroy(): void {
    this.reset();
  }
}
