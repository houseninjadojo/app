import Service from '@ember/service';

/**
 * HubSpot Chat SDK Service
 * @see https://developers.hubspot.com/docs/api/conversation/chat-widget-sdk
 */

window.hsConversationsSettings = {
  /**
   * Whether the widget should implicitly load or wait until the
   * `widget.load` method is called
   *
   * @param {Boolean}
   */
  loadImmediately: false,

  /**
   * Where the widget should be embedded in the page.
   * If a selector (e.g. `#some-id`) is provided, the widget
   * will be embedded inline within that DOM node. It will
   * always be open until it is removed via `widget.remove`
   */
  inlineEmbedSelector: '#hn-hubspot-chat',

  /**
   * Control behavior of the cookie banner for all chatflows on the page:
   *
   *  - `false` - use the setting from chatflows (default)
   *  - `true` - enable cookie banners when the widget is loaded
   *  - `ON_WIDGET_LOAD` - same as true: enable cookie banners when the widget is loaded
   *  - `ON_EXIT_INTENT` - enable cookie banners when the user exhibits an exit intent
   *
   * Note that this field used to be a Boolean. It can now accommodate both
   * the original Boolean values and the updated enum values.
   */
  enableWidgetCookieBanner: false,

  /**
   * Whether or not the upload attachment button should be hidden
   * in the chat widget.
   */
  disableAttachment: false,
};

export default class HubspotChatService extends Service {
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
}
