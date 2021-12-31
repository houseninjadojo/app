import Service from '@ember/service';
import { A } from '@ember/array';

export default class NotificationsService extends Service {
  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowNotifications = false;

  queue = A();
}
