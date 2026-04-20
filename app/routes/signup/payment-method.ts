import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { OnboardingStep } from 'houseninja/data/enums/onboarding-step';
import StoreService from 'houseninja/services/store';
import OnboardingService from 'houseninja/services/onboarding';
import CreditCard from 'houseninja/models/credit-card';

class SignupPaymentMethodRoute extends Route {
  @service declare store: StoreService;
  @service declare onboarding: OnboardingService;

  async model(): Promise<CreditCard | undefined> {
    // while we are only using the monthly plan, we can
    // simply reload the subscription plan instance from the API
    this.store.unloadAll('subscription-plan');
    await this.store.findFirst('subscription-plan', { backgroundReload: true });

    // return the credit card model from the last step
    let creditCard = await this.onboarding.fetchLocalModel('credit-card');
    if (!isPresent(creditCard)) {
      creditCard = this.store.createRecord('credit-card');
    }
    return creditCard;
  }

  deactivate(): void {
    this.onboarding.completeStep(OnboardingStep.PaymentMethod);
  }
}

export default instrumentRoutePerformance(SignupPaymentMethodRoute);
