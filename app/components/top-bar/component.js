import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';

export default class TopBarComponent extends Component {
  @service router;
  @service intercom;

  @tracked unreadConversationCount = 0;

  preserveViewScrollPosition() {
    const mainView = document.querySelector('main.hn.view');
    const position = mainView && mainView.scrollTop;

    if (position) {
      localStorage.setItem(
        'preserveredScrollPosition',
        JSON.stringify({ route: this.router.currentRouteName, position })
      );
    }
  }

  preservePreviousRoute() {
    const { name, params } = this.router.currentRoute;

    localStorage.setItem(
      'preservedPreviousRoute',
      JSON.stringify({ name, params })
    );
  }

  @action
  toggleSettingsViewVisibility() {
    this.preserveViewScrollPosition();
    this.preservePreviousRoute();

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
