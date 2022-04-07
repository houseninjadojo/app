import Controller from '@ember/controller';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';

export default class DashboardIndexController extends Controller {
  @action
  async showMessenger() {
    await Intercom.displayMessageComposer({
      message: `Hi. I'm a new member and would like to add my property address to my account.`,
    });
  }
}
