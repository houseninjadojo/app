import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupIndexController extends Controller {
  @service current;
  @service store;
  @service router;

  @tracked zipcode;

  breadcrumbs = breadcrumbs.serviceArea;

  @action
  async checkServiceArea() {
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
  }
}
