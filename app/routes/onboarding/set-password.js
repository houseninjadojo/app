import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class OnboardingSetPasswordRoute extends Route {
  @service store;
  @service onboarding;

  async model({ user_id }) {
    return await this.store.findRecord('user', user_id);
  }
}
