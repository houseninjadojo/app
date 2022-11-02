import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { TrackedMap, TrackedWeakSet } from 'tracked-built-ins';
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
import { PluginImplementations } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Browser } from '@capacitor/browser';
import {
  Intercom,
  UnreadConversationCount,
} from '@capacitor-community/intercom';
import {
  BranchDeepLinks,
  BranchDeepLinksPlugin,
} from 'capacitor-branch-deep-links';
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

type BranchLinks = BranchDeepLinksPlugin & {
  removeAllListeners: () => void;
};

const pluginMap = {
  app: App,
  branch: BranchDeepLinks as BranchLinks,
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
  'intercom.did-start-new-conversation',
  'intercom.help-center-will-show',
  'intercom.help-center-did-show',
  'intercom.help-center-will-hide',
  'intercom.help-center-did-hide',
  'intercom.on-unread-count-change',
  'intercom.window-will-show',
  'intercom.window-did-show',
  'intercom.window-will-hide',
  'intercom.window-did-hide',
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

  setup(): void {
    this.teardownListeners();
    this.setupListeners();
  }

  subscribe(eventSlug: string): void {
    const { plugin, event }: EventCall = eventCall(eventSlug);
    const listener: ListenerFunc = (event?: any): void => {
      debug(`Event ${eventSlug} fired`);
      return this.trigger(eventSlug, event);
    };
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore PluginListenerHandle
      const handler = plugin.addListener(event, bind(this, listener));
      this.listeners.set(eventSlug, handler);
      debug(`Event ${eventSlug} subscribed`);
    } catch (e) {
      debug(`Event ${eventSlug} failed to subscribe`);
    }
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
    Object.values(pluginMap).forEach((plugin) => {
      plugin.removeAllListeners();
    });
  }
}
