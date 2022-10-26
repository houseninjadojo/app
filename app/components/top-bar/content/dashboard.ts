import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type RouterService from '@ember/routing/router-service';
import type IntercomService from 'houseninja/services/intercom';
import type ViewService from 'houseninja/services/view';

export default class TopBarDashboardContentComponent extends Component {
  @service declare router: RouterService;
  @service declare intercom: IntercomService;
  @service declare view: ViewService;

  @tracked unreadConversationCount = 0;

  @action
  toggleSettingsViewVisibility(): void {
    this.view.preserveViewScrollPosition(this.router);
    this.view.preservePreviousRoute(this.router);

    this.router.transitionTo(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX);
  }

  @action
  async getUnreadConversationCount(): Promise<number> {
    if (this.intercom.unreadConversationCount > 0) {
      return this.intercom.unreadConversationCount;
    }
    this.unreadConversationCount = await this.intercom.getUnreadCount();
    return this.unreadConversationCount;
  }

  @action
  showIntercom(): void {
    this.intercom.showMessenger();
  }
}
