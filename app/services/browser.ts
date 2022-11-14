import Service, { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import { debug } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

import EventBusService, {
  ListenablePlugin,
} from 'houseninja/services/event-bus';
import type MetricsService from './metrics';
import { captureException } from 'houseninja/utils/sentry';

export default class BrowserService extends Service {
  @service declare eventBus: EventBusService;
  @service declare metrics: MetricsService;

  plugin = Browser;
  pluginName = 'Browser';
  events = ['browserPageLoaded', 'browserFinished'];

  @tracked isBrowserOpen = false;
  @tracked currentUrl?: string;
  @tracked lastUrl?: string;

  setupListeners(): void {
    // no-op
  }

  teardownListeners(): void {
    this.removeAllListeners();
  }

  async open(options: {
    url: string;
    windowName?: string;
    toolbarColor?: string;
    presentationStyle?: 'fullscreen' | 'popover';
    showTitle?: boolean;
    toolbarBottom?: boolean;
    enableBarCollapsing?: boolean;
    closeButtonText?: string;
    backButtonCanClose?: boolean;
  }): Promise<void> {
    try {
      await Browser.open(options);
      this.currentUrl = options.url;
      this.isBrowserOpen = true;
      this.metrics.trackEvent({
        event: 'browser.opened',
        properties: options,
      });
      debug(`[browser] opened: ${options.url}`);
    } catch (e) {
      captureException(e as Error);
    }
  }

  async close(): Promise<void> {
    try {
      await Browser.close();
      this.isBrowserOpen = false;
      this.lastUrl = this.currentUrl;
      this.currentUrl = undefined;
      this.metrics.trackEvent({
        event: 'browser.closed',
        properties: { url: this.currentUrl },
      });
      debug('[browser] closed');
    } catch (e) {
      captureException(e as Error);
    }
  }

  async registerEvents(): Promise<void> {
    await this.removeAllListeners();
    await this.eventBus.registerEvents(
      this.plugin as ListenablePlugin,
      this.pluginName,
      this.events
    );
  }

  private async removeAllListeners(): Promise<void> {
    await Browser.removeAllListeners();
  }
}
