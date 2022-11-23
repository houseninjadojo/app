import { debug } from '@ember/debug';
import {
  getEventSlug,
  isListenablePlugin,
  isPluginListener,
} from 'houseninja/utils/event-bus';

import type EventBusService from 'houseninja/services/event-bus';
import type {
  HandlerFn,
  Listenable,
  ListenablePlugin,
  ListenableEvented,
  ListenerFunc,
} from 'houseninja/services/event-bus';

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
    if (eventSlug === 'user-activity.pointerdown') return;
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
export default class Handler {
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
