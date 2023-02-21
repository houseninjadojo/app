import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
export default class OnboardingSetPasswordRoute extends Route {
  @service store;
  @service onboarding;

  beforeModel() {
    if (!this.onboarding.isSubscribed) {
      this.router.transitionTo(SIGNUP_ROUTE.PAYMENT_METHOD);
    }
  }

  async model({ user_id }) {
    return await this.store.findRecord('user', user_id);
  }
}
