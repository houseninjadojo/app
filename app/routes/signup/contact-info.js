import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupContactInfoRoute extends Route {
  @service store;

  model() {
    return this.store.peekAll('user').get('firstObject');
  }
}
