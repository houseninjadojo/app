import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default class PaymentApprovalAuthenticator extends BaseAuthenticator {
  access_token = null;

  async restore(data) {
    return data;
  }

  async authenticate(access_token) {
    this.access_token = access_token;
    return {
      access_token,
      kind: 'payment-approval',
    };
  }

  async invalidate() {
    this.access_token = null;
    return;
  }
}
