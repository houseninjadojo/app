import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service intercom;
  @service view;

  @tracked unreadConversationCount = 0;

  @action
  toggleSettingsViewVisibility() {
    this.view.preserveViewScrollPosition(this.router);
    this.view.preservePreviousRoute(this.router);

    this.router.transitionTo('settings');
  }

  @action
  async getUnreadConversationCount() {
    const unreadConversationObject = await Intercom.unreadConversationCount();
    this.unreadConversationCount = unreadConversationObject.value || 0;

    await Intercom.addListener('onUnreadCountChange', ({ value }) => {
      this.unreadConversationCount = value;
    });
  }

  @action
  showIntercom() {
    this.intercom.show();
  }
}
