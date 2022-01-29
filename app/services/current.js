import Service, { service } from '@ember/service';

export default class CurrentService extends Service {
  @service store;
  @service session;

  user = null;
  // properties = [];
  property = null;
  device = null;
  paymentMethod = null;

  signup = {
    zipcode: null,
    contactInfo: {},
  };

  async load() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = await this.store.findRecord('user', user_id, {
        include: 'properties,properties.address,payment-methods',
      });

      const property = await this.user.properties.get('firstObject');
      this.property = await this.store.findRecord(
        'property',
        property.get('id'),
        { preload: { user: user_id } }
      );

      const paymentMethod = await this.user.paymentMethods.get('firstObject');
      this.paymentMethod = await this.store.findRecord(
        'payment-method',
        paymentMethod.get('id'),
        { preload: { user: user_id } }
      );
    }
  }
}
