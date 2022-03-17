import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ButtonComponent extends Component {
  @service haptics;

  get isDisabled() {
    return this.args.isDisabled;
  }

  @action
  async handleClick() {
    this.haptics.giveFeedback(this.args.turnOffHapticFeedback);
  }
}
