import Service, { service } from '@ember/service';
import Evented from '@ember/object/evented';
import { TrackedMap } from 'tracked-built-ins';
import { dasherize } from '@ember/string';
import { bind } from '@ember/runloop';
import { debug } from '@ember/debug';

import type { PluginListenerHandle } from '@capacitor/core';
import {
  App,
  StateChangeListener,
  URLOpenListener,
  RestoredListener,
  BackButtonListener,
} from '@capacitor/app';
import type Branch from 'houseninja/lib/branch';
import { Browser } from '@capacitor/browser';
import type {
  Intercom,
  UnreadConversationCount,
} from '@capacitor-community/intercom';
import type { PushNotifications } from '@capacitor/push-notifications';

import type BrowserService from 'houseninja/services/browser';
import type CapacitorService from 'houseninja/services/capacitor';
import type IntercomService from 'houseninja/services/intercom';
import type NotificationsService from 'houseninja/services/notifications';
import type BranchService from 'houseninja/services/branch';

type PluginInstance =
  | typeof App
  | typeof Branch
  | typeof Browser
  | typeof Intercom
  | typeof PushNotifications;

type UnreadCountChangeListener = (event: UnreadConversationCount) => void;

type ListenerFunc =
  | StateChangeListener
  | URLOpenListener
  | RestoredListener
  | BackButtonListener
  | UnreadCountChangeListener;

export default class EventBusService extends Service.extend(Evented) {
  @service declare branch: BranchService;
  @service declare browser: BrowserService;
  @service declare capacitor: CapacitorService;
  @service declare intercom: IntercomService;
  @service declare notifications: NotificationsService;

  listeners = new TrackedMap<string, PluginListenerHandle>();
  eventSubscriptions = new Set();

  willDestroy() {
    this.teardownListeners();
    super.willDestroy();
  }

  async setup(): Promise<void> {
    await this.branch.registerEvents();
    await this.browser.registerEvents();
    await this.capacitor.registerEvents();
    await this.intercom.registerEvents();
    await this.notifications.registerEvents();
  }

  hasSubscription(pluginName: string, eventName: string): boolean {
    const slug = this.eventSlug(pluginName, eventName);
    return this.listeners.has(slug);
  }

  eventSlug(pluginName: string, eventName: string): string {
    return `${dasherize(pluginName)}.${dasherize(eventName)}`;
  }

  // eslint-disable-next-line prettier/prettier
  async registerEvents(plugin: PluginInstance, pluginName: string, events: string[]): Promise<void> {
    events.forEach(async (eventName) => {
      if (!this.hasSubscription(pluginName, eventName)) {
        await this.subscribe(plugin, pluginName, eventName);
      }
    });
  }

  listenerFor(eventSlug: string): ListenerFunc {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event?: any): void => {
      debug(`[event-bus] ${eventSlug} fired`);
      return this.trigger(eventSlug, event);
    };
  }

  // eslint-disable-next-line prettier/prettier
  async subscribe(plugin: PluginInstance, pluginName: string, eventName: string): Promise<void> {
    const eventSlug = this.eventSlug(pluginName, eventName);
    if (this.hasSubscription(pluginName, eventName)) {
      debug(`[event-bus] already subscribed to ${eventSlug}`);
      return;
    }
    const listener = this.listenerFor(eventSlug);
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore PluginListenerHandle
      const handler = await plugin.addListener(eventName, bind(this, listener));
      this.listeners.set(eventSlug, handler);
      this.eventSubscriptions.add({ plugin, pluginName, eventName });
      debug(`[event-bus] ${eventSlug} subscribed`);
    } catch (e) {
      debug(`[event-bus] ${eventSlug} failed to subscribe`);
    }
  }

  async teardownListeners(): Promise<void> {
    await this.listeners.forEach((handler, eventSlug) => {
      debug(`[event-bus] ${eventSlug} unsubscribed`);
      handler.remove();
      this.listeners.delete(eventSlug);
    });
    await this.branch.teardownListeners();
    await this.browser.teardownListeners();
    await this.capacitor.teardownListeners();
    await this.intercom.teardownListeners();
    await this.notifications.teardownListeners();
  }
}
