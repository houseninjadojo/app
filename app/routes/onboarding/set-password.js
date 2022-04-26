import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class OnboardingSetPasswordRoute extends Route {
  @service store;
  @service onboarding;

  async model({ userId }) {
    return await this.store.findRecord('user', userId);
  }
}
