import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import isNativePlatform from 'houseninja/utils/is-native-platform';
export default class ButtonComponent extends Component {
  @action
  async handleClick() {
    if (this.args.turnOffHapticFeedback !== true) {
      isNativePlatform() &&
        (await Haptics.impact({ style: ImpactStyle.Light }));
    }
  }
}
