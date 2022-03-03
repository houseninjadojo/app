import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';

export default class HomeCareTipComponent extends Component {
  @service router;

  @action
  async openChatModal() {
    await Intercom.displayMessageComposer({
      message: this.args.defaultHNChatMessage || '',
    });
  }
}
