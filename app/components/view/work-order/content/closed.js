import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';

export default class WorkOrderClosedViewContentComponent extends Component {
  get imageUrl() {
    const document = this.args.model.invoice.get('document');

    return document?.get('url');
  }

  @action
  openBrowser() {
    if (this.imageUrl) {
      Browser.open({
        url: this.imageUrl,
        presentationStyle: 'popover',
      });
    }
  }
}
