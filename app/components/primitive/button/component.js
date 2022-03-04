import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default class ButtonComponent extends Component {
  @action
  async handleClick() {
    if (this.args.turnOffHapticFeedback !== true) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }
}
