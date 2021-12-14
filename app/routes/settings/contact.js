import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsContactRoute extends Route {
  @service current;

  async model() {
    await this.current.user.reload();
    return this.current.user;
  }
}
