import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsContactRoute extends Route {
  @service current;

  async model() {
    await this.current.loadUser();
    return this.current.user;
  }
}
