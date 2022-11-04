import Service, { service } from '@ember/service';
import { bind } from '@ember/runloop';
import { Capacitor } from '@capacitor/core';
import Sentry, { startSpan } from 'houseninja/utils/sentry';
import {
  App,
  type AppState,
  type AppInfo,
  type AppLaunchUrl,
} from '@capacitor/app';

import type EventBusService from 'houseninja/services/event-bus';
import type RouterService from '@ember/routing/router-service';
import { captureMessage } from '@sentry/hub';

export default class CapacitorService extends Service {
  @service declare eventBus: EventBusService;
  @service declare router: RouterService;

  plugin = App;
  pluginName = 'App';
  events = [
    'appStateChange',
    'appUrlOpen',
    'appRestoredResult',
    'pause',
    'resume',
    'backButton',
  ];

  /**
   * Helpers
   */

  convertFileSrc(filePath: string): string {
    return Capacitor.convertFileSrc(filePath);
  }

  getPlatform(): string {
    return Capacitor.getPlatform();
  }

  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }

  async exitApp(): Promise<void> {
    return await App.exitApp();
  }

  async getInfo(): Promise<AppInfo> {
    return await App.getInfo();
  }

  async getState(): Promise<AppState> {
    return await App.getState();
  }

  async getLaunchUrl(): Promise<AppLaunchUrl | undefined> {
    return await App.getLaunchUrl();
  }

  async minimizeApp(): Promise<void> {
    return await App.minimizeApp();
  }

  /**
   * Handlers
   */

  handleAppUrlOpen(event: AppLaunchUrl) {
    const { url } = event;
    logUrlOpen(url);
    const { raw } = parseUrl(url);
    const route = this.router.recognize(raw);
    if (!route) {
      captureMessage(`Could not recognize route: ${raw}`);
      return;
    }
    if (route?.name === 'login.callback') {
      this.router.transitionTo(raw);
    } else {
      this.router.transitionTo(raw);
    }
  }

  /**
   * Listeners
   */

  async setup() {
    this.setupListeners();
  }

  setupListeners() {
    this.eventBus.on('app.app-url-open', bind(this, this.handleAppUrlOpen));
  }

  teardownListeners() {
    this.removeAllListeners();
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
    await App.removeAllListeners();
  }
}

/**
 * utils
 */

const parseUrl = (url: string) => {
  const parsed = new URL(url);
  const queryParams = Object.fromEntries(parsed.searchParams.entries());
  const pathName =
    parsed.hash.length > 0 ? parsed.hash.replace('#', '') : parsed.pathname;
  return {
    raw: `${pathName}${parsed.search}`,
    name: pathName,
    model: null, // perhaps later
    options: {
      queryParams,
    },
  };
};

const logUrlOpen = (url: string) => {
  startSpan({
    op: 'app.url.open',
    description: `opening app with url: ${url}`,
    tags: { url },
  })?.finish();
  Sentry.addBreadcrumb({
    type: 'user',
    category: 'app.url.open',
    message: 'opening app with url',
    data: { url },
  });
};
