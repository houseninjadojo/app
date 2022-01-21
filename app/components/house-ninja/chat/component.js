import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ChatViewComponent extends Component {
  @service router;

  goBack() {
    const previousRoute = localStorage.getItem('preservedPreviousRoute');
    if (previousRoute) {
      this.router.transitionTo(previousRoute);
      localStorage.removeItem('preservedPreviousRoute');
    } else {
      this.router.transitionTo('home');
    }

    this.args.closeCallback && this.args.closeCallback();
  }

  @action
  removeChat() {
    window.HubSpotConversations.widget.remove();
    this.goBack();
  }

  openChat() {
    window.HubSpotConversations.widget.load({ widgetOpen: true });
  }
}
