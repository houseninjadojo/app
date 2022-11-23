import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

type AuthenticationPayload = {
  access_token: string;
  kind: string;
};

export default class PaymentApprovalAuthenticator extends BaseAuthenticator {
  access_token?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async restore(data: any): Promise<any> {
    return data;
  }

  async authenticate(access_token: string): Promise<AuthenticationPayload> {
    this.access_token = access_token;
    return {
      access_token,
      kind: 'payment-approval',
    };
  }

  async invalidate(): Promise<void> {
    this.access_token = undefined;
    return;
  }
}
