import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class ServiceActivityRecordsComponent extends Component {
  @service router;
  @service view;
  @service haptics;
  @service intercom;

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();

    if (typeof route === 'object') {
      this.view.preservePreviousRoute(this.router);
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.WORK_ORDER, route.id);
    }
  }

  @action
  openChatModal() {
    this.intercom.show();
  }
}
