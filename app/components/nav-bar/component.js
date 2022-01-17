import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { debug } from '@ember/debug';

export default class NavBarComponent extends Component {
  @service router;
  @service hubspotChat;

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
    this.hubspotChat.open();
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
