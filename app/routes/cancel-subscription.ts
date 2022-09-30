import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';
import type User from 'houseninja/models/user';
import type Subscription from 'houseninja/models/subscription';

interface Model {
  user: User | undefined;
  subscription: Subscription | undefined;
}

export default class CancelSubscriptionRoute extends Route {
  @service declare current: any;
  @service declare store: StoreService;

  async model() {
    const model: Model = {
      user: undefined,
      subscription: undefined,
    };

    await this.current.loadUser();
    model.user = this.current.user;

    if (model.user?.subscription) {
      model.subscription = this.store.peekRecord(
        'subscription',
        model.user.subscription.get('id') as string
      );
    }

    return model;
  }
}
