import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupPropertyInfoRoute extends Route {
  @service store;

  async model() {
    await this.store.findAll('service-area');
  }
}
