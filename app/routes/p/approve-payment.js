import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApprovePaymentRoute extends Route {
  @service current;
  @service router;
  @service session;
  @service store;

  async model({ access_token }) {
    await this.session.authenticate(
      'authenticator:payment-approval',
      access_token
    );

    return await this.store.findRecord('work-order', access_token, {
      include: [
        'invoice',
        'invoice.payment',
        'property',
        'property.user',
        'property.user.payment_methods',
      ].join(','),
    });
  }
}
