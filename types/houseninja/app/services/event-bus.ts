/* eslint-disable @typescript-eslint/no-explicit-any */

import UserActivityService from 'houseninja/services/user-activity';
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
} from '@houseninja/capacitor-intercom';
import type { PushNotifications } from '@capacitor/push-notifications';

declare module 'houseninja/services/event-bus' {
  export type PluginInstance =
    | typeof App
    | typeof Branch
    | typeof Browser
    | typeof Intercom
    | typeof PushNotifications;

  export type UnreadCountChangeListener = (
    event: UnreadConversationCount
  ) => void;

  export type ListenerFunc =
    | StateChangeListener
    | URLOpenListener
    | RestoredListener
    | BackButtonListener
    | UnreadCountChangeListener
    | ((event: any) => any);

  export type HandlerFn = PluginListenerHandle | unknown;

  export interface ListenablePlugin {
    addListener: (
      eventName: string,
      listenerFunc: ((event: any) => any) | (() => void)
    ) => void;
    [key: string]: any;
  }

  export interface ListenableEvented {
    on: (eventName: string, listenerFunc: (event: any) => any) => void;
    [key: string]: any;
  }

  export interface ListenableAlsoEvented {
    on:
      | ((eventName: string, listenerFunc: (event: any) => any) => void)
      | ((
          eventName: string,
          context: ThisType<any>,
          callbackFn: (event: any) => Promise<void>
        ) => void);
    [key: string]: any;
  }

  export type Listenable =
    | ListenablePlugin
    | ListenableEvented
    | UserActivityService;
}
