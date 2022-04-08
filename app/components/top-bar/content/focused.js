import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class TopBarDashboardContentComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  dashboardHomeRoute = NATIVE_MOBILE_ROUTE.DASHBOARD.HOME;

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
