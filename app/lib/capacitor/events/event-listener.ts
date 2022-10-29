import type { Plugin, PluginListenerHandle } from '@capacitor/core';
import { debug } from '@ember/debug';
import Evented from '@ember/object/evented';
import { run } from '@ember/runloop';

import type Event from 'houseninja/lib/capacitor/events/event';

interface EventBus extends Evented {
  a: string;
}

export default class EventListener {
  bus: EventBus;
  plugin: Plugin;
  event: string;
  handler: PluginListenerHandle | undefined;

  constructor(bus: EventBus, plugin: Plugin, event: string) {
    this.bus = bus;
    this.plugin = plugin;
    this.event = event;
  }

  async listener<E extends Event>(event: E): Promise<void> {
    run(() => {
      debug(`Received event: ${this.event}`);
      this.bus.trigger(this.event, event);
    });
  }

  async register(): Promise<void> {
    this.handler = await this.plugin.addListener(this.event, this.listener);
  }

  async unregister(): Promise<void> {
    await this.handler?.remove();
  }
}
