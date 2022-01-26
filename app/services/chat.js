import Service, { service } from '@ember/service';
import Smooch from 'smooch';
import ENV from 'houseninja/config/environment';

export default class ChatService extends Service {
  @service current;

  setup() {
    const { integrationId } = ENV.smooch;

    return Smooch.init({
      integrationId,
      embedded: false, // if set to true, you must call `render()` manually. @see https://github.com/zendesk/sunshine-conversations-web#embedded-mode
    });
  }

  // @see https://github.com/zendesk/sunshine-conversations-web#embedded-mode
  render(element) {
    return Smooch.render(element);
  }

  /**
   * Logs a user in the Web Messenger, retrieving the conversations the user
   * already had on other browser sessions and/or devices. Note that you don't
   * need to call this after init if you already passed the external id and
   * jwt as arguments in the call to init, in which case it's done internally
   * as part of the initialization sequence. This returns a Promise that
   * resolves when the Web Messenger is ready again.
   */
  async login() {
    const { email, smoochJWT } = await this.current.user.getProperties(
      'email',
      'smoochJWT'
    );
    return Smooch.login(email, smoochJWT);
  }

  /**
   * Logs out the current user and reinitialize the widget with an anonymous
   * user. This returns a promise that resolves when the Web Messenger is
   * ready again.
   */
  async logout() {
    return Smooch.logout();
  }

  /**
   * Destroys the Web Messenger and makes it disappear. The Web Messenger
   * has to be reinitialized with init to be working again because it also
   * clears up the integration id from the Web Messenger. It will also unbind
   * all listeners you might have with Smooch.on.
   */
  // eslint-disable-next-line ember/classic-decorator-hooks
  async destroy() {
    return Smooch.destroy();
  }

  /**
   * Opens the conversation widget (noop when embedded)
   */
  open() {
    Smooch.open();
  }

  /**
   * Closes the conversation widget (noop when embedded)
   */
  close() {
    Smooch.close();
  }

  /**
   * Updates the current user's information. If no user has been created yet,
   * the Web Messenger will store the information and apply it to the user model
   * when it is created.
   */
  async updateUser() {
    const { firstName, lastName, email } =
      await this.current.user.getProperties('firstName', 'lastName', 'email');
    return await Smooch.updateUser({
      givenName: firstName,
      surname: lastName,
      email: email,
      externalId: email,
      metadata: {
        justGotUpdated: true,
      },
    });
  }

  /**
   * Creates a conversation on behalf of current user. If the user does not
   * exist, it first creates the user and then a conversation associated with it.
   *
   * All the options are optional.
   */
  async createConversation(options) {
    // @todo make some defaults
    options ||= {
      displayName: "Friday's Order",
      iconUrl: 'https://www.zen-tacos.com/tacos.png',
      description: 'Order #13377430',
      metadata: {
        isFirstTimeCustomer: true,
      },
      messages: [
        {
          text: 'Hi there! I have a question about my order.',
          type: 'text',
        },
      ],
    };
    return await Smooch.createConversation(options);
  }

  /**
   * Returns a list of conversations for the current user that were fetched during
   * app initialization as well as the paginated results.
   *
   * Note:
   *  - The messages property in each conversation may only have the most recent
   *    message in the conversation. The full message list will be available either
   *    when the conversation was loaded to the view or `Smooch.getConversationById`
   *    gets called.
   *  - In the event that the client reconnects due to a network issue, the list may
   *    only contain the 10 most recent conversations for the user. All the additional
   *    conversations that were fetched as a result of pagination will be discarded.
   *
   * @see `Smooch.getConversationById`` for the definition of a conversation
   */
  async getConversations() {
    return await Smooch.getConversations();
  }

  /**
   * Prefills the user's chat input with a predefined message.
   */
  async setPredefinedMessage(msg) {
    return await Smooch.setPredefinedMessage(msg);
  }
}
