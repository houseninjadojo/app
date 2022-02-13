import BaseSessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';

/**
 * @see https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/services/session.js
 */
export default class SessionService extends BaseSessionService {
  @service current;

  async handleAuthentication() {
    super.handleAuthentication(...arguments);

    try {
      this.current.loadIdentifyAndTrack.perform();
    } catch (err) {
      await this.invalidate();
    }
  }

  async setup() {
    await super.setup();
    this.current.loadIdentifyAndTrack.perform();
  }
}
