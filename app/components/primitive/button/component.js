import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { service } from '@ember/service';
export default class ButtonComponent extends Component {
  @service haptics;

  @action
  async handleClick() {
    if (
      this.haptics.provideHapticFeedback &&
      this.args.turnOffHapticFeedback !== true
    ) {
      isNativePlatform() &&
        (await Haptics.impact({ style: ImpactStyle.Light }));
    }
  }
}
