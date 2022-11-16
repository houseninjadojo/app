import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service intercom;
  @service view;

  // @tracked unreadConversationCount = 0;

  get unreadConversationCount() {
    return this.intercom.unreadConversationCount;
  }

  @action
  toggleSettingsViewVisibility() {
    this.view.preserveViewScrollPosition(this.router);
    this.view.preservePreviousRoute(this.router);

    this.router.transitionTo(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX);
  }

  // @action
  // async getUnreadConversationCount() {
  //   this.unreadConversationCount =
  //     await this.intercom.fetchUnreadConversationCount();
  //   return this.unreadConversationCount;
  // }

  @action
  showIntercom() {
    this.intercom.showMessenger();
  }
}
