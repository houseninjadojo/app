import Component from '@glimmer/component';
import { action } from '@ember/object';
// import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';

export default class CommonRequestsComponent extends Component {
  @action
  async openChatWithPrompt(message) {
    await Intercom.displayMessageComposer({ message });
  }
}
