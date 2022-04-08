import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class NavBarComponent extends Component {
  @service analytics;
  @service router;

  dashboardHomeRoute = NATIVE_MOBILE_ROUTE.DASHBOARD.HOME;
  dashboardHandleItRoute = NATIVE_MOBILE_ROUTE.DASHBOARD.HANDLE_IT;
  dashboardHistoryRoute = NATIVE_MOBILE_ROUTE.DASHBOARD.HISTORY;

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
    await this.analytics.track('Intercom Opened', {
      message: '',
    });
    await Intercom.displayMessageComposer({ message: '' });
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
