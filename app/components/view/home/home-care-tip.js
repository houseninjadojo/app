import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class HomeCareTipComponent extends Component {
  @service intercom;
  @action
  async openChatModal(message) {
    this.intercom.showComposer(message);
  }
}
