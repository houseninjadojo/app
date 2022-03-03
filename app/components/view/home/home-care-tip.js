import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';

export default class HomeCareTipComponent extends Component {
  @action
  async openChatModal(message) {
    await Intercom.displayMessageComposer({ message });
  }
}
