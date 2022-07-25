import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default class DashboardIndexController extends Controller {
  @service intercom;
  @service current;

  @action
  showMessenger() {
    this.intercom.showComposer(
      `Hi. I'm a new member and would like to add my property address to my account.`
    );
  }

  get showPropertyDialog() {
    if (this.current.user) {
      let property = this.current.user.get('properties.firstObject');
      return isBlank(this.current.property || property);
    } else {
      return false;
    }
  }
}
