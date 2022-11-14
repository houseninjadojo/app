/* eslint-disable @typescript-eslint/no-explicit-any */

import Ember from 'ember';
import Route from '@ember/routing/route';
import UserActivityService from 'ember-user-activity/addon/services/user-activity';

declare global {
  // Prevents ESLint from "fixing" this via its auto-fix to turn it into a type
  // alias (e.g. after running any Ember CLI generator)
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}

  namespace NodeJS {
    interface ProcessEnv {
      DATADOG_RUM_APP_ID: string;
      readonly [key: string]: string | undefined;
    }
  }
}

export {};

/**
  Get the resolved type of an item.

  - If the item is a promise, the result will be the resolved value type
  - If the item is not a promise, the result will just be the type of the item
 */
export type Resolved<P> = P extends Promise<infer T> ? T : P;

/** Get the resolved model value from a route. */
export type ModelFrom<R extends Route> = Resolved<ReturnType<R['model']>>;

// Misc
// type PluginInstance =
//   | typeof App
//   | typeof Branch
//   | typeof Browser
//   | typeof Intercom
//   | typeof PushNotifications;

// type UnreadCountChangeListener = (event: UnreadConversationCount) => void;

// type ListenerFunc =
//   | StateChangeListener
//   | URLOpenListener
//   | RestoredListener
//   | BackButtonListener
//   | UnreadCountChangeListener
//   | ((event: any) => any);

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
