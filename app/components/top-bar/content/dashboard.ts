import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import RouterService from '@ember/routing/router-service';
import IntercomService from 'houseninja/services/intercom';
import ViewService from 'houseninja/services/view';

export default class TopBarDashboardContentComponent extends Component {
  @service declare router: RouterService;
  @service declare intercom: IntercomService;
  @service declare view: ViewService;

  get unreadConversationCount() {
    return this.intercom.unreadConversationCount;
  }

  @action
  toggleSettingsViewVisibility() {
    this.view.preserveViewScrollPosition(this.router);
    this.view.preservePreviousRoute(this.router);

    this.router.transitionTo(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX);
  }

  @action
  showIntercom() {
    this.intercom.showMessenger();
  }
}
