import { Plugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import {
  ActionPerformed as PushActionPerformed,
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import {
  ActionPerformed as LocalActionPerformed,
  LocalNotifications,
  LocalNotificationSchema,
} from '@capacitor/local-notifications';
import { Intercom } from '@capacitor-community/intercom';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
import Notification, {
  NotificationSchema,
  NotificationType,
} from 'houseninja/lib/notification';
import { dasherize } from '@ember/string';

type NotificationPluginEvent =
  | PushNotificationSchema
  | PushActionPerformed
  | LocalNotificationSchema
  | LocalActionPerformed;

type CapacitorPlugin =
  | Plugin
  | typeof Intercom
  | typeof BranchDeepLinks
  | undefined;

export default class CapacitorEvent {
  name: string;
  data: object;
  readonly plugin: CapacitorPlugin;
  readonly pluginName: string = 'Plugin';

  constructor(name: string, data = {}) {
    this.name = name;
    this.data = data;
  }

  get slug(): string {
    return `${this.pluginName.toLowerCase()}.${dasherize(this.name)}`;
  }
}

export class AppEvent extends CapacitorEvent {
  pluginName = 'App';
  plugin = App;
}

export class BrowserEvent extends CapacitorEvent {
  pluginName = 'Browser';
  plugin = Browser;
}

export class NotificationEvent extends CapacitorEvent {
  notification: Notification;
  actionId?: string;
  inputValue?: string;

  constructor(
    name: string,
    data: NotificationPluginEvent,
    type: NotificationType = NotificationType.Local
  ) {
    super(name, data);
    if ('actionId' in data) {
      this.actionId = data.actionId;
      this.inputValue = data.inputValue;
      const notification = data.notification as NotificationSchema;
      this.notification = new Notification(notification, type);
    } else {
      const notification = data as NotificationSchema;
      this.notification = new Notification(notification, type);
    }
  }

  get type(): NotificationType {
    return this.notification.type;
  }

  get payload(): any {
    return this.notification.payload;
  }

  cancel(): void {
    // no-op
  }
}

export class PushNotificationEvent extends NotificationEvent {
  pluginName = 'PushNotifications';
  plugin = PushNotifications;

  constructor(name: string, data: NotificationPluginEvent) {
    super(name, data);
  }
}

export class LocalNotificationEvent extends NotificationEvent {
  pluginName = 'LocalNotifications';
  plugin = LocalNotifications;

  cancel(): void {
    const id = this.notification.id as number;
    this.plugin.cancel({
      notifications: [{ id }],
    });
  }
}

export class IntercomEvent extends CapacitorEvent {
  pluginName = 'Intercom';
  plugin = Intercom;
}

export class BranchEvent extends CapacitorEvent {
  pluginName = 'Branch';
  plugin = BranchDeepLinks;
}
