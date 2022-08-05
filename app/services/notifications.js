import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { debug } from '@ember/debug';

export default class NotificationsService extends Service {
  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowRemoteNotifications = false;

  // set to true on initialization
  // @see app/instance-initializers/notifications.js
  canShowLocalNotifications = false;

  @tracked queue = A();

  /**
   * Add notification to the queue
   *
   * @param {Object} notification
   */
  add(kind, state, notification) {
    debug(
      `From Native ->  Notifications add ${kind} ${state} ${notification.id}`
    );
    console.log(notification);
    this.queue.pushObject(
      EmberObject.create({
        kind,
        state,
        ...notification,
      })
    );
  }

  remove(id) {
    this.queue.removeObject(this.find(id));
  }

  findBy(keyId, key) {
    return this.queue.findBy(keyId, key);
  }

  find(id) {
    return this.findBy('id', id);
  }
}
