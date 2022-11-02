import BaseAdapter, {
  IdentifyOptions,
} from 'ember-metrics/metrics-adapters/base';
import { service } from '@ember/service';
import type IntercomService from 'houseninja/services/intercom';

interface IntercomOptions extends IdentifyOptions {
  email: string;
  hmac: string;
}

export default class CapacitorIntercom extends BaseAdapter {
  @service declare intercom: IntercomService;

  toStringExtension() {
    return 'CapacitorIntercom';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    // no-op
  }

  identify(options: IntercomOptions): void {
    const { distinctId, email, hmac } = options;
    this.intercom.loginUser(distinctId, email, hmac);
  }

  // eslint-disable-next-line prettier/prettier
  trackEvent(options: { event: string; properties?: Record<string, unknown> }): void {
    const { event, properties } = options;
    if (event.includes('intercom.') || event.includes('click')) return;
    this.intercom.logEvent(event, properties);
  }

  trackPage(): void {
    // no-op
  }

  alias(): void {
    // no-op
  }

  reset(): void {
    this.intercom.logout();
  }

  uninstall(): void {
    this.reset();
  }

  willDestroy() {
    this.reset();
  }
}
