import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ShelfComponent extends Component {
  @service router;

  @action
  goBack() {
    const previousRoute = localStorage.getItem('preservedPreviousRoute');
    if (previousRoute) {
      this.router.transitionTo(previousRoute);
      localStorage.removeItem('preservedPreviousRoute');
    } else {
      this.router.transitionTo('home');
    }
  }
}
