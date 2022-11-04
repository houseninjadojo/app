import type {
  BranchError,
  InitOptions,
  JourneyEvent,
  SessionData,
} from 'branch-sdk';
import * as branch from 'branch-sdk';
import {
  BranchDeepLinks,
  BranchReferringParamsResponse,
} from '@houseninja/capacitor-branch';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { tracked } from 'tracked-built-ins';
import { service } from '@ember/service';
import { getOwner } from '@ember/application';

import type { PluginListenerHandle } from '@capacitor/core';
import type EventBusService from 'houseninja/services/event-bus';

type ListenerEvent = JourneyEvent | CapacitorEvent;
type CapacitorEvent = 'initError' | 'init';

declare global {
  interface Window {
    Houseninja: any;
  }
}

export default class Branch {
  // @service declare static eventBus: EventBusService;

  static sessionData = tracked({});

  static async init(
    branch_key?: string,
    options?: InitOptions | undefined
  ): Promise<void> {
    const cb = (err: BranchError, data: SessionData | null) => {
      const eventBus = getOwner(window.Houseninja)?.lookup(
        'service:event-bus'
      ) as EventBusService;
      if (err) {
        eventBus?.trigger('branch.init-error', err);
        BranchDeepLinks.notifyListeners('initError', err);
      } else {
        eventBus?.trigger('branch.init', data);
        BranchDeepLinks.notifyListeners('init', data);
      }
    };
    if (!isNativePlatform() && branch_key) {
      branch.init(branch_key, options, cb);
    }
  }

  static async data(): Promise<object | undefined> {
    if (!isNativePlatform()) {
      return new Promise((resolve, reject) => {
        branch.data((err, data) => {
          if (err) reject(err);
          else resolve({ ...data });
        });
      });
    } else {
      return Promise.resolve(Branch.sessionData);
    }
  }

  static async addListener(
    eventName: ListenerEvent | string,
    listenerFunc: (event: any) => void
  ): Promise<PluginListenerHandle> {
    if (!isNativePlatform()) {
      branch.addListener(eventName as JourneyEvent, listenerFunc);
      const remove = async () => branch.removeListener(listenerFunc);
      return { remove };
    } else {
      if (eventName === 'init') {
        return await BranchDeepLinks.addListener(
          eventName as 'init',
          listenerFunc
        );
      } else {
        return await BranchDeepLinks.addListener(
          eventName as 'initError',
          listenerFunc
        );
      }
    }
  }

  static async removeListener(
    eventName: string,
    listenerFunc: (event: any) => void
  ): Promise<void> {
    if (!isNativePlatform()) {
      branch.removeListener(listenerFunc);
    }
  }

  static async removeAllListeners(): Promise<void> {
    // no-op
  }

  static async setIdentity(options: {
    newIdentity: string;
  }): Promise<BranchReferringParamsResponse> {
    if (!isNativePlatform()) {
      return new Promise((resolve, reject) => {
        branch.setIdentity(options.newIdentity, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              referringParams: {
                '+clicked_branch_link': false,
                '+is_first_session': false,
                ...data,
              },
            });
          }
        });
      });
    } else {
      return await BranchDeepLinks.setIdentity(options);
    }
  }

  static async logout(): Promise<{ logged_out: boolean }> {
    if (!isNativePlatform()) {
      return new Promise((resolve, reject) => {
        branch.logout((err) => {
          if (err) reject(err);
          else resolve({ logged_out: true });
        });
      });
    } else {
      return await BranchDeepLinks.logout();
    }
  }

  static async sendBranchEvent(options: {
    eventName: string;
    metaData?: { customerEventAlias?: string; [key: string]: any };
  }): Promise<void> {
    if (!isNativePlatform()) {
      return new Promise((resolve, reject) => {
        branch.logEvent(
          options.eventName,
          options.metaData,
          undefined,
          options.metaData?.customerEventAlias,
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } else {
      const { eventName, metaData } = options;
      const { customerEventAlias, ...rest } = metaData || {}; // eslint-disable-line @typescript-eslint/no-unused-vars
      const newOptions = { eventName, metaData: rest };
      return await BranchDeepLinks.sendBranchEvent(newOptions);
    }
  }
}
