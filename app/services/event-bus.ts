import Service, { service } from '@ember/service';
import Evented from '@ember/object/evented';
import { TrackedMap } from 'tracked-built-ins';
import { dasherize } from '@ember/string';
import { bind } from '@ember/runloop';
import { debug } from '@ember/debug';

import { PluginListenerHandle } from '@capacitor/core';
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
import type MetricsService from 'houseninja/services/metrics';
import type BranchService from 'houseninja/services/branch';
import type {
  Listenable,
  ListenablePlugin,
  ListenableEvented,
} from 'houseninja';

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
  | UnreadCountChangeListener
  | ((event: any) => any); // eslint-disable-line @typescript-eslint/no-explicit-any

type HandlerFn = PluginListenerHandle | unknown;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPluginListener = (handler: any): handler is PluginListenerHandle => {
  return typeof handler?.remove === 'function';
};

const isListenablePlugin = (
  plugin: any // eslint-disable-line @typescript-eslint/no-explicit-any
): plugin is PluginInstance & ListenablePlugin => {
  return typeof plugin.addListener === 'function';
};

export default class EventBusService extends Service.extend(Evented) {
  @service declare branch: BranchService;
  @service declare browser: BrowserService;
  @service declare capacitor: CapacitorService;
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare notifications: NotificationsService;

  listeners = new TrackedMap<string, HandlerFn>();
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
    await this.metrics.registerEvents();
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
  async registerEvents(plugin: Listenable, pluginName: string, events: string[]): Promise<void> {
    events.forEach(async (eventName) => {
      if (!this.hasSubscription(pluginName, eventName)) {
        await this.subscribe(plugin, pluginName, eventName);
      }
    });
  }

  listenerFor = (eventSlug: string): ListenerFunc => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event?: any): void => {
      debug(`[event-bus] ${eventSlug} fired`);
      return this.trigger(eventSlug, event);
    };
  };

  async subscribe(
    instance: Listenable,
    instanceName: string,
    eventName: string
  ): Promise<void> {
    const eventSlug = this.eventSlug(instanceName, eventName);
    if (this.hasSubscription(instanceName, eventName)) {
      debug(`[event-bus] already subscribed to ${eventSlug}`);
      return;
    }
    const listener = this.listenerFor(eventSlug);
    try {
      let handler;
      if (isListenablePlugin(instance)) {
        handler = await instance.addListener(eventName, bind(this, listener));
      } else {
        handler = (instance as ListenableEvented).on(
          eventName,
          bind(this, listener)
        );
      }
      this.listeners.set(eventSlug, handler);
      this.eventSubscriptions.add({ instance, instanceName, eventName });
      debug(`[event-bus] ${eventSlug} subscribed`);
    } catch (e) {
      debug(`[event-bus] ${eventSlug} failed to subscribe`);
    }
  }

  async teardownListeners(): Promise<void> {
    await this.listeners.forEach((handler, eventSlug) => {
      debug(`[event-bus] ${eventSlug} unsubscribed`);
      if (isPluginListener(handler)) handler.remove();
      this.listeners.delete(eventSlug);
    });
    await this.branch.teardownListeners();
    await this.browser.teardownListeners();
    await this.capacitor.teardownListeners();
    await this.intercom.teardownListeners();
    await this.metrics.teardownListeners();
    await this.notifications.teardownListeners();
  }
}
