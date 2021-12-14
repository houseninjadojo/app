import Service, { inject as service } from '@ember/service';

export default class CurrentService extends Service {
  @service store;
  @service session;

  user = null;
  property = null;

  async load() {
    if (this.session.isAuthenticated) {
      const { user_id } = this.session.data.authenticated.userinfo;
      this.user = await this.store.findRecord('user', user_id, {
        include: 'property',
      });
      console.log(this.user.property);
      this.property = this.user.property;
    }
  }
}
