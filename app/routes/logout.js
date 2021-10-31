import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;
  @service router;

  async beforeModel(transition) {
    await this.session.invalidate();
    transition.to('index');
  }
}
