import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsPropertyRoute extends Route {
  @service current;

  async model() {
    await this.current.property.address.reload();
    return this.current.property.address;
  }
}
