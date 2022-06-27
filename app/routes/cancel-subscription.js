import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class CancelSubscriptionRoute extends Route {
  @service current;
  @service store;

  async model() {
    const model = {
      user: null,
      subscription: null,
    };

    await this.current.loadUser();
    model.user = this.current.user;

    if (model.user.subscription) {
      model.subscription = await this.store.findRecord(
        'subscription',
        model.user?.subscription?.get('id')
      );
    }

    return model;
  }
}
