import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { AREA_NOTIFICATION } from 'houseninja/data/enums/onboarding-step';

export default class SignupAreaNotificationRoute extends Route {
  @service onboarding;

  activate() {
    this.onboarding.currentStep = AREA_NOTIFICATION;
  }

  deactivate() {
    this.onboarding.completeStep(AREA_NOTIFICATION);
  }
}
