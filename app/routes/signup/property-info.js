import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { PROPERTY_INFO } from 'houseninja/data/enums/onboarding-step';

export default class SignupPropertyInfoRoute extends Route {
  @service store;
  @service onboarding;

  model() {
    this.store.findAll('service-area', {
      backgroundReload: true,
    });
    return this.store.peekAll('property').get('firstObject');
  }

  deactivate() {
    this.onboarding.completeStep(PROPERTY_INFO);
  }
}
