import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

import type CurrentService from 'houseninja/services/current';
import type OnboardingService from 'houseninja/services/onboarding';
import type RouterService from '@ember/routing/router-service';
import type StoreService from 'houseninja/services/store';

type Args = {
  zipcode: string;
};

export default class ServiceAreaComponent extends Component<Args> {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare onboarding: OnboardingService;
  @service declare store: StoreService;

  @tracked zipcode;
  @tracked formIsInvalid = true;
  @tracked isLoading = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    if (this.validZipcode(this.args.zipcode)) {
      this.zipcode = this.args.zipcode;
      this.formIsInvalid = false;
    }
  }

  @action
  async checkServiceArea(): Promise<void> {
    this.isLoading = true;
    let serviceArea;
    try {
      serviceArea = await this.store.queryRecord('service-area', {
        filter: {
          zipcodes: [this.zipcode],
        },
      });
    } catch (e) {
      captureException(e as Error);
    } finally {
      this.isLoading = false;
    }
    if (isPresent(serviceArea)) {
      this.onboarding.set('zipcode', this.zipcode);
      this.router.transitionTo(SIGNUP_ROUTE.CONTACT_INFO);
    } else {
      this.current.signup.zipcode = this.zipcode;
      this.router.transitionTo(SIGNUP_ROUTE.AREA_NOTIFICATION);
    }
  }

  @action
  validateForm(e: Event): void {
    const el = <HTMLInputElement>e.target;
    this.zipcode = el?.value;

    if (this.validZipcode(this.zipcode)) {
      this.formIsInvalid = false;
    } else {
      this.formIsInvalid = true;
    }
  }

  validZipcode(zipcode: string): boolean {
    return zipcode?.length >= 5;
  }
}
