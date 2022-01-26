import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class NavBarComponent extends Component {
  @service router;
  @service chat;

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

  openChatModal() {
    console.log('Open Chat');
    this.chat.open();
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
