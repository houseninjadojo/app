import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ButtonComponent extends Component {
  @service haptics;

  @action
  async handleClick() {
    this.haptics.giveFeedback(this.args.turnOffHapticFeedback);
  }
}
