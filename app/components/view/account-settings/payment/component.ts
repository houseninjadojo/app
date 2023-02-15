import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import ViewService from 'houseninja/services/view';
import RouterService from '@ember/routing/router-service';

export default class PaymentSettingsComponent extends Component {
  @service declare router: RouterService;
  @service declare view: ViewService;

  @action
  selectRoute(routeName: string): void {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(routeName);
  }
}
