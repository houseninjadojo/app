import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ButtonComponent extends Component {
  @service haptics;

  @action
  async handleClick() {
    // @TODO figure out why this inconsistently fires.
    // Temporary fix by importing the service and calling giveFeedback where this global
    // button handler doesn't fire.
    this.haptics.giveFeedback(this.args.turnOffHapticFeedback);
  }
}
