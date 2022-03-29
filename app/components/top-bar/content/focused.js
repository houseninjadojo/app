import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();

    if (route === 'back') {
      this.view.transitionToPreviousRoute();
    } else {
      this.router.transitionTo(route);
    }
  }
}
