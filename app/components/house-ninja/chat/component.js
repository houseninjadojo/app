import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HouseNinjaChatComponent extends Component {
  @service hubspotChat;
  @tracked visible = false;

  // constructor() {
  //   window.HubSpotConversations.on('conversationStarted', (payload) => {
  //     console.log(
  //       `Started conversation with id ${payload.conversation.conversationId}`
  //     );
  //   });
  //   super(...arguments);
  // }

  get visibility() {
    if (!this.visible) {
      return 'hidden';
    } else {
      return '';
    }
  }
}
