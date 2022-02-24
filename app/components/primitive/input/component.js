import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';

export default class InputComponent extends Component {
  get descriptionText() {
    const { alert, warn, description } = this.args;
    const obj = alert || warn;
    let descriptionString = '';

    if (isPresent(obj)) {
      if (obj.title && obj.detail) {
        descriptionString += `${obj.title} - ${obj.detail}`;
      } else {
        descriptionString += obj.title || obj.detail;
      }
    } else if (description) {
      descriptionString = description;
    }
    return descriptionString;
  }

  @action
  handleInput(e) {
    e.target.value = e.target.value.trim();
    this.args.onInput && this.args.onInput(e);
  }
}
