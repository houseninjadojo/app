import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { debug } from '@ember/debug';

export default class NavBarComponent extends Component {
  @service intercom;
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
    debug('Open Chat');
    this.intercom.show();
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
