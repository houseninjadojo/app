import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service intercom;
  @service view;

  @tracked unreadConversationCount = 0;

  listener = null;

  @action
  toggleSettingsViewVisibility() {
    this.view.preserveViewScrollPosition(this.router);
    this.view.preservePreviousRoute(this.router);

    this.router.transitionTo(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX);
  }

  @action
  async getUnreadConversationCount() {
    const unreadConversationObject = await Intercom.unreadConversationCount();
    this.unreadConversationCount = unreadConversationObject.value || 0;

    this.listener = Intercom.addListener(
      'onUnreadCountChange',
      this.onUnreadCountChange.bind(this)
    );
  }

  onUnreadCountChange({ value }) {
    this.unreadConversationCount = value;
  }

  @action
  showIntercom() {
    this.intercom.show();
  }

  willDestroy() {
    super.willDestroy();
    this.listener?.remove();
  }
}
