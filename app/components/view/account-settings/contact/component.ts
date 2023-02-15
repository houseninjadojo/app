import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';

export default class ContactSettingsComponent extends Component {
  @service declare router: RouterService;
  @service declare view: ViewService;

  @action
  selectRoute(routeName: string): void {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(routeName);
  }
}
