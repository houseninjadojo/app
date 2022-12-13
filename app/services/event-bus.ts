import Service, { service } from '@ember/service';
import Evented from '@ember/object/evented';
import { debug } from '@ember/debug';
import { getEventSlug } from 'houseninja/utils/event-bus';
import Handler from 'houseninja/lib/event-bus/handler';
import Manager from 'houseninja/lib/event-bus/manager';

import type BrowserService from 'houseninja/services/browser';
import type CapacitorService from 'houseninja/services/capacitor';
import type IntercomService from 'houseninja/services/intercom';
import type NotificationsService from 'houseninja/services/notifications';
import type MetricsService from 'houseninja/services/metrics';
import type BranchService from 'houseninja/services/branch';

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
    this.branch.registerEvents();
    this.browser.registerEvents();
    this.capacitor.registerEvents();
    this.intercom.registerEvents();
    this.metrics.registerEvents();
    this.notifications.registerEvents();
    this.subscribeWindowEvents();
  }

  // eslint-disable-next-line prettier/prettier
  async registerEvents(plugin: Listenable, pluginName: string, events: string[]): Promise<void> {
    events.forEach(async (eventName) => {
      await this.subscribe(plugin, pluginName, eventName);
    });
  }

  // eslint-disable-next-line prettier/prettier
  async subscribe(instance: Listenable, instanceName: string, eventName: string): Promise<void> {
    const eventSlug = getEventSlug(instanceName, eventName);
    if (this.manager.hasHandler(eventSlug)) {
      debug(`[event-bus] already subscribed to ${eventSlug}`);
      return;
    }
    try {
      const handler = await Handler.from(
        instance,
        instanceName,
        eventName,
        this
      );
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
    await this.unsubscribeWindowEvents();
  }

  /** Window Events */

  async subscribeWindowEvents(): Promise<void> {
    await this.subscribe(window, 'window', 'message');
  }

  async unsubscribeWindowEvents(): Promise<void> {
    await this.manager.removeHandler('window.message');
  }
}
