import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { captureException } from 'houseninja/utils/sentry';
import { isPresent } from '@ember/utils';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

export default class ServiceAreaComponent extends Component {
  @service current;
  @service router;
  @service onboarding;
  @service store;

  @tracked zipcode;
  @tracked formIsInvalid = true;

  constructor() {
    super(...arguments);
    if (this.validZipcode(this.args.zipcode)) {
      this.zipcode = this.args.zipcode;
      this.formIsInvalid = false;
    }
  }

  @action
  async checkServiceArea() {
    let serviceArea;
    try {
      serviceArea = await this.store.queryRecord('service-area', {
        filter: {
          zipcodes: [this.zipcode],
        },
      });
      console.log(serviceArea);
    } catch (e) {
      captureException(e);
    }
    if (isPresent(serviceArea)) {
      this.onboarding.zipcode = this.zipcode;
      this.router.transitionTo(SIGNUP_ROUTE.CONTACT_INFO);
    } else {
      this.current.signup.zipcode = this.zipcode;
      this.router.transitionTo(SIGNUP_ROUTE.AREA_NOTIFICATION);
    }
  }

  @action
  validateForm(e) {
    this.zipcode = e.target.value;

    if (this.validZipcode(this.zipcode)) {
      this.formIsInvalid = false;
    } else {
      this.formIsInvalid = true;
    }
  }

  validZipcode(zipcode) {
    return zipcode?.length >= 5;
  }
}
