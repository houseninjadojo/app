import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupPropertyInfoRoute extends Route {
  @service store;

  model() {
    this.store.findAll('service-area', {
      backgroundReload: true,
    });
    return this.store.peekAll('property').get('firstObject');
  }
}
