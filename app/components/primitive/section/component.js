import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SectionComponent extends Component {
  @tracked isOpen = true;
  allowCollapse = false || this.args.allowCollapse;

  @action
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
