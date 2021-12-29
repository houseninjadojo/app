import Service, { service } from '@ember/service';

export default class CurrentService extends Service {
  @service store;
  @service session;

  user = null;
  // properties = [];
  property = null;

  async load() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = await this.store.findRecord('user', user_id, {
        include: 'properties,properties.address',
      });

      const property = await this.user.properties.get('firstObject');
      this.property = await this.store.findRecord(
        'property',
        property.get('id'),
        { preload: { user: user_id } }
      );
    }
  }
}
