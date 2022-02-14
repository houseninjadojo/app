import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupPaymentMethodRoute extends Route {
  @service store;

  model() {
    return this.store.peekAll('payment-method').get('firstObject');
  }
}
