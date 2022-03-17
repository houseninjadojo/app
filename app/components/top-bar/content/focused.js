import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service view;

  @action
  selectRoute(route) {
    if (route === 'back') {
      this.view.preserveViewScrollPosition(this.router);
      this.view.preservePreviousRoute(this.router);

      window.history.back();
    } else {
      this.router.transitionTo(route);
    }
  }
}
