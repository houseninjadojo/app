import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default class NavBarComponent extends Component {
  @service router;

  /**
   * The current route selection
   */
  get currentRoute() {
    return this.router.currentRouteName;
  }

  get isHomeActive() {
    return this.currentRoute.includes('home') ? 'active' : '';
  }
  get isHandleItActive() {
    return this.router.currentRouteName.includes('handle-it') ? 'active' : '';
  }
  get isWorkHistoryActive() {
    return this.currentRoute.includes('work-history') ? 'active' : '';
  }

  openChatModal() {
    console.log('Open Chat');
  }

  @action
  selectRoute(routeName) {
    console.log(routeName);
    this.selected = routeName;
    this.router.transitionTo(routeName);
  }
}
