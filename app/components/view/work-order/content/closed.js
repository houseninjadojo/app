import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';

export default class WorkOrderClosedViewContentComponent extends Component {
  get imageUrl() {
    const invoice = this.args.model.invoice;
    const document = invoice.get('document');
    const url = document?.get('url');

    return url;
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
