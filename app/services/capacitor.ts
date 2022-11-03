import Service, { service } from '@ember/service';
import { Capacitor } from '@capacitor/core';
import {
  App,
  type AppState,
  type AppInfo,
  type AppLaunchUrl,
} from '@capacitor/app';

import type EventBusService from 'houseninja/services/event-bus';

export default class CapacitorService extends Service {
  @service declare eventBus: EventBusService;

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

  setupListeners() {
    this.registerEvents();
  }

  teardownListeners() {
    this.removeAllListeners();
  }

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

  registerEvents(): void {
    this.removeAllListeners();
    this.eventBus.registerEvents(this.plugin, this.pluginName, this.events);
  }

  private removeAllListeners(): void {
    App.removeAllListeners();
  }
}
