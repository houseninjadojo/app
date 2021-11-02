import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class NavBarComponent extends Component {
  /**
   * The current route selection
   */
  @tracked selected = 'dashboard';

  isActive(routeName) {
    return this.selected === routeName ? 'active' : '';
  }

  @action
  selectRoute(routeName) {
    this.selected = routeName;
    this.router.transitionTo(routeName);
  }
}
