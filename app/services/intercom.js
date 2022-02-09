import Service from '@ember/service';
import { service } from '@ember/service';
import { Intercom } from '@capacitor-community/intercom';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class IntercomService extends Service {
  @service current;

  async setup() {
    // hide launcher on mobile devices
    if (isNativePlatform()) {
      await Intercom.hideLauncher();
      await Intercom.hideInAppMessages();
    }
  }

  async registerUser(userId, email, hmac) {
    await Intercom.registerIdentifiedUser({
      userId,
      email,
    });
    await Intercom.setUserHash({ hmac });
  }

  async unreadConversationCount() {
    const { value } = await Intercom.unreadConversationCount();
    return value;
  }

  async setupListeners() {
    // await Intercom.addListener('onUnreadCountChange', ({ value }) => {
    //   console.log('UNREAD COUNT CHANGED: ', value);
    // });
  }
}
