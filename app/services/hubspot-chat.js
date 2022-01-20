import Service, { service } from '@ember/service';

export default class HubspotChatService extends Service {
  @service current;

  load() {
    window.HubSpotConversations.widget.load({ widgetOpen: true });
  }

  refresh(openToNewThread = false) {
    window.HubSpotConversations.widget.refresh({ openToNewThread });
  }

  open() {
    window.HubSpotConversations.widget.open();
  }

  close() {
    window.HubSpotConversations.widget.close();
  }

  remove() {
    window.HubSpotConversations.widget.remove();
  }

  // Whether the widget iframe has loaded or not.
  loaded() {
    let { loaded } = window.HubSpotConversations.widget.status();
    return loaded;
  }

  // clear out any chat related cookies
  clear(resetWidget = true) {
    window.HubSpotConversations.clear({ resetWidget });
  }

  async identifyUser() {
    await this.current.user.reload();
    const { email, hubspotVisitorToken } = this.current.user.getProperties(
      'email',
      'hubspotVisitorToken'
    );
    window.hsConversationsSettings['identificationEmail'] = email;
    window.hsConversationsSettings['identificationToken'] = hubspotVisitorToken;
  }
}
