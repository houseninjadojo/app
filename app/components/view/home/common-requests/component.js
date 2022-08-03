import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CommonRequestsComponent extends Component {
  @service intercom;

  @action
  async openChatWithPrompt(message) {
    this.intercom.showComposer(message);
  }
}
