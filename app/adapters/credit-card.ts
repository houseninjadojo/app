import ApplicationAdapter from './application';

export default class CreditCardAdapter extends ApplicationAdapter {
  pathForType(): string {
    return 'payment-methods';
  }
}
