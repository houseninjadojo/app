import BaseSessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';

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
}
