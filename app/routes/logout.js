import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;

  async beforeModel(transition) {
    this.session.terminate(transition);
  }
}
