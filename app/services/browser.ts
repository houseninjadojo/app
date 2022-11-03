import Service, { service } from '@ember/service';
import { Browser } from '@capacitor/browser';

import type EventBusService from 'houseninja/services/event-bus';
import { debug } from '@ember/debug';

export default class BrowserService extends Service {
  @service declare eventBus: EventBusService;

  plugin = Browser;
  pluginName = 'Browser';
  events = ['browserPageLoaded', 'browserFinished'];

  setupListeners() {
    this.removeAllListeners();
    this.registerEvents();
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
    return await Browser.open(options);
  }

  async close(): Promise<void> {
    debug('Browser close');
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
