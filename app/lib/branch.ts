import {
  Branch as BranchWeb,
  BranchError,
  InitOptions,
  JourneyEvent,
  SessionData,
} from 'branch-sdk';
import * as branch from 'branch-sdk';
import {
  BranchDeepLinks,
  BranchReferringParamsResponse,
} from 'capacitor-branch-deep-links';
import isNativePlatform from 'houseninja/utils/is-native-platform';

import { PluginListenerHandle } from '@capacitor/core';

type ListenerEvent = JourneyEvent | CapacitorEvent;
type CapacitorEvent = 'initError' | 'init';

export default class Branch {
  static async init(
    branch_key?: string,
    options?: InitOptions | undefined,
    callback?:
      | ((err: BranchError, data: SessionData | null) => void)
      | undefined
  ): Promise<void> {
    if (!isNativePlatform() && branch_key) {
      branch.init(branch_key, options, callback);
    }
  }

  static async addListener(
    eventName: ListenerEvent,
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
          if (err) {
            reject(err);
          } else {
            resolve({ logged_out: true });
          }
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
      const { customerEventAlias, ...rest } = metaData || {};
      const newOptions = { eventName, metaData: rest };
      return await BranchDeepLinks.sendBranchEvent(newOptions);
    }
  }
}
