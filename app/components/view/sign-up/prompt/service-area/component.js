import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class ServiceAreaComponent extends Component {
  @service current;
  @service router;
  @service onboarding;
  @service store;

  @tracked zipcode;
  @tracked formIsInvalid = true;

  constructor() {
    super(...arguments);
    console.log(this.args.zipcode);
    this.zipcode = this.args.zipcode;
  }

  @action
  async checkServiceArea() {
    try {
      const serviceAreas = await this.store.query('service-area', {
        filter: {
          zipcodes: [this.zipcode],
        },
      });
      if (serviceAreas.length > 0) {
        this.onboarding.setZipcode(this.zipcode);
        this.router.transitionTo('signup.contact-info');
      } else {
        this.current.signup.zipcode = this.zipcode;
        this.router.transitionTo('signup.area-notification');
      }
    } catch (e) {
      debug(e);
      Sentry.captureException(e);
    }
  }

  @action
  validateForm(e) {
    this.zipcode = e.target.value;

    if (this.zipcode && this.zipcode.length >= 5) {
      this.formIsInvalid = false;
    } else {
      this.formIsInvalid = true;
    }
  }
}
