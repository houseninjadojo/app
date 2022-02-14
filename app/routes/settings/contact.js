import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsContactRoute extends Route {
  @service current;
  @service store;

  async model() {
    const userId = this.current.user.id;
    return await this.store.findRecord('user', userId, {
      backgroundReload: true,
    });
  }
}
