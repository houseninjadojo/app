import Service, { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import { debug } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

import type EventBusService from 'houseninja/services/event-bus';
import type MetricsService from './metrics';

export default class BrowserService extends Service {
  @service declare eventBus: EventBusService;
  @service declare metrics: MetricsService;

  plugin = Browser;
  pluginName = 'Browser';
  events = ['browserPageLoaded', 'browserFinished'];

  @tracked isBrowserOpen = false;
  @tracked currentUrl?: string;
  @tracked lastUrl?: string;

  setupListeners() {
    // no-op
  }

  teardownListeners() {
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
    debug(`Browser open: ${options.url}`);
    this.metrics.trackEvent({
      event: 'browser.open',
      properties: options,
    });
    this.currentUrl = options.url;
    this.isBrowserOpen = true;
    return await Browser.open(options);
  }

  async close(): Promise<void> {
    debug('Browser close');
    this.metrics.trackEvent({
      event: 'browser.close',
      properties: { url: this.currentUrl },
    });
    this.isBrowserOpen = false;
    this.lastUrl = this.currentUrl;
    this.currentUrl = undefined;
    return await Browser.close();
  }

  async registerEvents(): Promise<void> {
    await this.removeAllListeners();
    await this.eventBus.registerEvents(
      this.plugin,
      this.pluginName,
      this.events
    );
  }

  private async removeAllListeners(): Promise<void> {
    await Browser.removeAllListeners();
  }
}
