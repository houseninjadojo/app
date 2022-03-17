import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ServiceActivityRecordsComponent extends Component {
  @service router;

  @action
  selectRoute(route) {
    if (typeof route === 'object') {
      this.router.transitionTo(`work-order`, route.id);
    }
  }
}
