import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';
import type User from 'houseninja/models/user';
import type Subscription from 'houseninja/models/subscription';
import type CurrentService from 'houseninja/services/current';

interface Model {
  user: User | undefined;
  subscription: Subscription | undefined;
}

export default class CancelSubscriptionRoute extends Route {
  @service declare current: CurrentService;
  @service declare store: StoreService;

  async model(): Promise<Model> {
    const model: Model = {
      user: undefined,
      subscription: undefined,
    };

    await this.current.loadUser();
    model.user = this.current.user;

    const subscriptionId = model.user?.subscription?.get('id');
    if (subscriptionId) {
      model.subscription = this.store.peekRecord(
        'subscription',
        subscriptionId
      );
    }

    return model;
  }
}
