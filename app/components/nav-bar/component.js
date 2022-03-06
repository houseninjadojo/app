import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';
import Sentry from 'houseninja/utils/sentry';

export default class NavBarComponent extends Component {
  @service analytics;
  @service router;

  /**
   * The current route selection
   */
  get currentRoute() {
    return this.router.currentRouteName || '';
  }

  get isHomeActive() {
    return this.currentRoute.includes('home') ? 'active' : '';
  }
  get isHandleItActive() {
    return this.currentRoute.includes('handle-it') ? 'active' : '';
  }
  get isWorkHistoryActive() {
    return this.currentRoute.includes('work-history') ? 'active' : '';
  }

  @action
  async openChatModal() {
    await this.analytics.track('opened intercom', {
      message: '',
    });
    await Intercom.displayMessageComposer({ message: '' });
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
