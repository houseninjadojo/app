import ApplicationAdapter from './application';

export default class CreditCardAdapter extends ApplicationAdapter {
  pathForType() {
    return 'payment-methods';
  }
}
