import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';

export default class NavBarComponent extends Component {
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
  openChatModal() {
    console.log('Open Chat');
    Intercom.displayMessenger();
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
