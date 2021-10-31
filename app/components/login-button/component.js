import Component from '@glimmer/component';
import { action } from '@ember/object';
import isNativePlatform from 'dojo/utils/is-native-platform';
import { Browser } from '@capacitor/browser';
import { tracked } from '@glimmer/tracking';

export default class LoginButton extends Component {
  @tracked url;

  @action
  async platformOpen() {
    let url = this.url;
    if (isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.location.assign(url);
    }
  }
}
