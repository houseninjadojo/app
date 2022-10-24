import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type RouterService from '@ember/routing/router-service';
import type IntercomService from 'houseninja/services/intercom';
import type ViewService from 'houseninja/services/view';
import type HapticsService from 'houseninja/services/haptics';
import type WorkOrder from 'houseninja/models/work-order';

export default class ServiceActivityRecordsComponent extends Component {
  @service declare router: RouterService;
  @service declare view: ViewService;
  @service declare haptics: HapticsService;
  @service declare intercom: IntercomService;

  @action
  selectRoute(route: WorkOrder | string): void {
    this.haptics.giveFeedback();

    if (typeof route === 'object') {
      this.view.preservePreviousRoute(this.router);
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.WORK_ORDERS.SHOW, route.id);
    }
  }

  @action
  openChatModal(): void {
    this.intercom.showComposer('I’d like to request a service.');
  }
}
