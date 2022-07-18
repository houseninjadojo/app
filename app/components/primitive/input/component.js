import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';

export default class InputComponent extends Component {
  @tracked hasValue = false;
  @tracked isFocused = false;

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
  handleInsert(e) {
    const input = e.querySelector('.hn-input');

    if (!this.args.hideLabel && input?.value) {
      this.hasValue = true;
    } else {
      this.hasValue = false;
    }
  }

  @action
  handleFocus() {
    if (!this.args.hideLabel) this.isFocused = true;
  }

  @action
  handleBlur() {
    if (!this.args.hideLabel && !this.hasValue) this.isFocused = false;
  }

  @action
  handleInput(e) {
    this.args.onInput && this.args.onInput(e);

    if (!this.args.hideLabel && e.target.value) {
      this.hasValue = true;
    } else {
      this.hasValue = false;
    }
  }
}
