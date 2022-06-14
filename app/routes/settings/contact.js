import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default class SettingsContactRoute extends Route {
  @service current;
  @service store;

  async model() {
    let userId = this.current?.user?.id;

    if (isBlank(this.current.user)) {
      await this.current.loadUser();
      userId = this.current.user.id;
    }
    return await this.store.findRecord('user', userId, {
      backgroundReload: true,
    });
  }
}
