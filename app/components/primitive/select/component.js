import Component from '@glimmer/component';
import { action } from '@ember/object';

// eslint-disable-next-line
export default class SelectComponent extends Component {
  @action
  handleChange(e) {
    if (this.args.onChange) {
      this.args.onChange(e);
    }
  }
}
