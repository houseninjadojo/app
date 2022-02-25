import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ShelfComponent extends Component {
  @service router;

  @action
  goBack() {
    const previousRoute = JSON.parse(
      localStorage.getItem('preservedPreviousRoute')
    );
    const { name, params } = previousRoute;

    if (Object.keys(params).length && name) {
      // @todo There's got to be a better way to pass the an >1 paramter values, but I can't figure it out.
      this.router.transitionTo(name, Object.values(params)[0]);
      localStorage.removeItem('preservedPreviousRoute');
    } else if (name) {
      this.router.transitionTo(name);
      localStorage.removeItem('preservedPreviousRoute');
    } else {
      this.router.transitionTo('dashboard.home');
    }
  }
}
