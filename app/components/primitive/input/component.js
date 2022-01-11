import Component from '@glimmer/component';

export default class InputComponent extends Component {
  get descriptionText() {
    const alert = this.args.alert;
    const warn = this.args.warn;
    let description = this.args.description;
    var descriptionString = '';

    if (alert || warn) {
      description = alert || warn;
      if (description.title && description.detail) {
        descriptionString += `${description.title} - ${description.detail}`;
      } else {
        descriptionString += description.title || description.detail;
      }
    } else if (description) {
      descriptionString = description;
    }
    return descriptionString;
  }
}
