import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service view;

  @action
  selectRoute(route) {
    if (route === 'back') {
      this.view.transitionToPreviousRoute();
    } else {
      this.router.transitionTo(route);
    }
  }
}
