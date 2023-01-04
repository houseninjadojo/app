import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';

export default class ViewComponent extends Component {
  @service declare router: RouterService;
  @service declare view: ViewService;

  @action
  applyPreservedScrollPosition(): void {
    this.view.applyPreservedScrollPosition(this.router);
  }
}
