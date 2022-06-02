import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';

export default class WorkOrderClosedViewContentComponent extends Component {
  @action
  openBrowser() {
    if (this.args.model) {
      Browser.open({
        url: `${this.args.model.invoice.document.url}`,
        presentationStyle: 'popover',
      });
    }
  }
}
