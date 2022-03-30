import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ServiceActivityRecordsComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();

    if (typeof route === 'object') {
      this.view.preservePreviousRoute(this.router);
      this.router.transitionTo(`work-order`, route.id);
    }
  }
}
