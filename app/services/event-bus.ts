import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { TrackedMap } from 'tracked-built-ins';
import { camelize } from '@ember/string';
import { bind } from '@ember/runloop';

import {
  Capacitor,
  PluginResultData,
  PluginResultError,
} from '@capacitor/core';

import {
  App,
  // StateChangeListener,
  URLOpenListener,
  RestoredListener,
  BackButtonListener,
  AppState,
} from '@capacitor/app';
import { PushNotifications } from '@capacitor/push-notifications';
import { Browser } from '@capacitor/browser';
import {
  Intercom,
  UnreadConversationCount,
} from '@capacitor-community/intercom';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
import { PluginListenerHandle } from '@capacitor/core';
import { debug } from '@ember/debug';

type EventCall = {
  plugin: typeof pluginMap[keyof typeof pluginMap];
  event: string;
};
type PluginName = keyof typeof pluginMap;
type PluginInstance = typeof pluginMap[keyof typeof pluginMap];

type UnreadCountChangeListener = (event: UnreadConversationCount) => void;
type StateChangeListener = (event: AppState) => void;

type ListenerFunc =
  | StateChangeListener
  | URLOpenListener
  | RestoredListener
  | BackButtonListener
  | UnreadCountChangeListener;

export type EventPayload = {
  readonly name: string;
  data?: PluginResultData;
  error?: PluginResultError;
};

const eventCall = (eventSlug: string): EventCall => {
  const [pluginName, eventName] = eventSlug.split('.') as [PluginName, string];
  const plugin: PluginInstance = pluginMap[pluginName];
  return {
    plugin,
    event: camelize(eventName),
  };
};

const pluginMap = {
  app: App,
  branch: BranchDeepLinks,
  browser: Browser,
  intercom: Intercom,
  'push-notifications': PushNotifications,
};

const eventsList = [
  'app.app-url-open',
  'app.app-state-change',
  'app.app-restored-result',
  'app.pause',
  'app.resume',
  'app.back-button',
  'branch.init',
  'branch.init-error',
  'browser.browser-page-loaded',
  'browser.browser-finished',
  'intercom.on-unread-count-change',
  'push-notifications.registration',
  'push-notifications.registration-error',
  'push-notifications.push-notification-received',
  'push-notifications.push-notification-action-performed',
];

export default class EventBusService extends Service.extend(Evented) {
  listeners = new TrackedMap<string, PluginListenerHandle>();

  willDestroy() {
    this.teardownListeners();
    super.willDestroy();
  }

  // constructor() {
  //   super();
  //   this.setupListeners();
  // }

  subscribe(eventSlug: string): void {
    const { plugin, event }: EventCall = eventCall(eventSlug);
    const listener: ListenerFunc = (event?: any): void => {
      debug(`Event ${eventSlug} fired`);
      return this.trigger(eventSlug, event);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore PluginListenerHandle
    const handler = plugin.addListener(event, bind(this, listener));
    this.listeners.set(eventSlug, handler);
    debug(`Event ${eventSlug} subscribed`);
  }

  setupListeners(): void {
    if (!Capacitor.addListener) {
      debug('Capacitor is not available');
      return;
    }
    eventsList.forEach((eventSlug) => {
      if (this.listeners.has(eventSlug)) {
        debug(`Event ${eventSlug} is already subscribed`);
        return;
      }
      this.subscribe(eventSlug);
    });
  }

  teardownListeners(): void {
    this.listeners.forEach((handler, eventSlug) => {
      debug(`Event ${eventSlug} unsubscribed`);
      handler.remove();
      this.listeners.delete(eventSlug);
    });
  }
}
