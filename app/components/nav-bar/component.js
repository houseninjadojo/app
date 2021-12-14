import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

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

  openChatModal() {
    console.log('Open Chat');
  }

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
