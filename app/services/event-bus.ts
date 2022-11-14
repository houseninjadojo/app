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

export default class EventBusService extends Service.extend(Evented) {
  @service declare branch: BranchService;
  @service declare browser: BrowserService;
  @service declare capacitor: CapacitorService;
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare notifications: NotificationsService;

  manager = new Manager();

  willDestroy(): void {
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

  // eslint-disable-next-line prettier/prettier
  async registerEvents(plugin: Listenable, pluginName: string, events: string[]): Promise<void> {
    events.forEach(async (eventName) => {
      await this.subscribe(plugin, pluginName, eventName);
    });
  }

  async subscribe(
    instance: Listenable,
    instanceName: string,
    eventName: string
  ): Promise<void> {
    const eventSlug = getEventSlug(instanceName, eventName);
    if (this.manager.hasHandler(eventSlug)) {
      debug(`[event-bus] already subscribed to ${eventSlug}`);
      return;
    }
    try {
      const handler = Handler.from(instance, instanceName, eventName, this);
      this.manager.addHandler(eventSlug, handler);
      debug(`[event-bus] ${eventSlug} subscribed`);
    } catch (e) {
      debug(`[event-bus] ${eventSlug} failed to subscribe`);
    }
  }

  async teardownListeners(): Promise<void> {
    await this.manager.removeHandlers();
    await this.branch.teardownListeners();
    await this.browser.teardownListeners();
    await this.capacitor.teardownListeners();
    await this.intercom.teardownListeners();
    await this.metrics.teardownListeners();
    await this.notifications.teardownListeners();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPluginListener = (handler: any): handler is PluginListenerHandle => {
  return typeof handler?.remove === 'function';
};

const isListenablePlugin = (
  plugin: any // eslint-disable-line @typescript-eslint/no-explicit-any
): plugin is PluginInstance & ListenablePlugin => {
  return typeof plugin.addListener === 'function';
};

const getEventSlug = (pluginName: string, eventName: string): string => {
  return `${dasherize(pluginName)}.${dasherize(eventName)}`;
};

/**
 * Listener
 *
 * A listener is a function that is called when an event is triggered.
 */
const listenerFor = (
  context: EventBusService,
  eventSlug: string
): ListenerFunc => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (event?: any): void => {
    debug(`[event-bus] ${eventSlug} fired`);
    return context.trigger(eventSlug, event);
  };
};

/**
 * Handler
 *
 * A handler is a wrapper around a plugin listener. It is responsible for
 * subscribing to a plugin event and unsubscribing from it when the handler is
 * removed.
 */
class Handler {
  handler: HandlerFn;
  instance: Listenable;
  instanceName: string;
  eventName: string;
  eventSlug: string;

  constructor(instance: Listenable, instanceName: string, eventName: string) {
    this.instance = instance;
    this.instanceName = instanceName;
    this.eventName = eventName;
    this.eventSlug = getEventSlug(instanceName, eventName);
  }

  addListener(eventSlug: string, handler: HandlerFn): Handler {
    this.eventSlug = eventSlug;
    this.handler = handler;
    return this;
  }

  static fromPlugin(
    instance: ListenablePlugin,
    instanceName: string,
    eventName: string,
    context: EventBusService
  ): Handler {
    const handler = new Handler(instance, instanceName, eventName);
    const listener = listenerFor(context, handler.eventSlug);
    const handlerFn = instance.addListener(eventName, listener);
    return handler.addListener(handler.eventSlug, handlerFn);
  }

  static fromEvented(
    instance: ListenableEvented,
    instanceName: string,
    eventName: string,
    context: EventBusService
  ): Handler {
    const eventSlug = getEventSlug(instanceName, eventName);
    const listener = listenerFor(context, eventSlug);
    return new Handler(instance, instanceName, eventName).addListener(
      eventSlug,
      instance.on(eventName, listener)
    );
  }

  static from(
    instance: Listenable,
    instanceName: string,
    eventName: string,
    context: EventBusService
  ): Handler {
    if (isListenablePlugin(instance)) {
      return Handler.fromPlugin(instance, instanceName, eventName, context);
    } else {
      return Handler.fromEvented(
        instance as ListenableEvented,
        instanceName,
        eventName,
        context
      );
    }
  }

  remove(): void {
    if (isPluginListener(this.handler)) {
      this.handler.remove();
    } else if (typeof this.handler === 'function') {
      this.instance.off(this.handler);
    }
    debug(`[event-bus] ${this.eventSlug} unsubscribed`);
  }
}

/**
 * Manager
 *
 * A manager is responsible for managing a collection of handlers. It is
 * responsible for adding and removing handlers.
 */
class Manager {
  private handlers = new TrackedMap<string, Handler>();

  addHandler(eventSlug: string, handler: Handler): void {
    if (this.handlers.has(eventSlug)) {
      this.handlers.get(eventSlug)?.remove();
    }
    this.handlers.set(eventSlug, handler);
  }

  removeHandler(eventSlug: string): void {
    this.handlers.get(eventSlug)?.remove();
    this.handlers.delete(eventSlug);
  }

  removeHandlers(): void {
    this.handlers.forEach((handler) => handler.remove());
    this.handlers.clear();
  }

  hasHandler(eventSlug: string): boolean {
    return this.handlers.has(eventSlug);
  }
}
