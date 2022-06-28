import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class DashboardIndexController extends Controller {
  @service intercom;

  @action
  showMessenger() {
    this.intercom.showComposer(
      `Hi. I'm a new member and would like to add my property address to my account.`
    );
  }
}
