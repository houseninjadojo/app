import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default class PaymentApprovalAuthenticator extends BaseAuthenticator {
  access_token = null;

  restore(data) {
    return data;
  }

  authenticate(access_token) {
    this.access_token = access_token;
    return {
      access_token,
      kind: 'payment-approval',
    };
  }

  invalidate() {
    this.access_token = null;
    return;
  }
}
