import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ContactSettingsComponent extends Component {
  @service router;
  @service view;

  @action
  selectRoute(routeName) {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(routeName);
  }
}
