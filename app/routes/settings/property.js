import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsPropertyRoute extends Route {
  @service current;

  async model() {
    await this.current.property.reload();
    return this.current.property;
  }
}
