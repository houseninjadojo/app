import Component from '@glimmer/component';

export default class InputComponent extends Component {
  get descriptionText() {
    const { alert, warn, description } = this.args;
    const obj = alert || warn;
    let descriptionString = '';

    if (obj) {
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
}
