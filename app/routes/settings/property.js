import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default class SettingsPropertyRoute extends Route {
  @service current;
  @service store;

  async model() {
    if (isBlank(this.current.property)) {
      await this.current.loadUser();
      return this.current.property;
    }
    return await this.store.findRecord('property', this.current.property.id, {
      backgroundReload: true,
    });
  }
}
