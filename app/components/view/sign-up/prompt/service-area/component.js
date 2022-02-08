import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import * as Sentry from '@sentry/ember';

export default class ServiceAreaComponent extends Component {
  @service current;
  @service router;
  @service store;

  @tracked zipcode;
  @tracked formIsInvalid = true;

  @action
  async checkServiceArea() {
    try {
      const serviceAreas = await this.store.query('service-area', {
        filter: {
          zipcodes: [this.zipcode],
        },
      });
      if (serviceAreas.length > 0) {
        this.router.transitionTo('signup.plan-selection');
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
