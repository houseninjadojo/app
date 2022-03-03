import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
export default class SectionComponent extends Component {
  @tracked isOpen = true;
  allowCollapse = false || this.args.allowCollapse;

  @action
  async toggle() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.isOpen = !this.isOpen;
  }
}
