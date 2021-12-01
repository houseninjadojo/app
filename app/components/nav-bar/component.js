import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class NavBarComponent extends Component {
  @service router;

  /**
   * The current route selection
   */
  @tracked selected = 'home';

  isActive(routeName) {
    return this.selected === routeName ? 'active' : '';
  }

  openChatModal() {
    console.log("Chat ");
  }

  @action
  selectRoute(routeName) {
    console.log(routeName);
    this.selected = routeName;
    this.router.transitionTo(routeName);
  }
}
