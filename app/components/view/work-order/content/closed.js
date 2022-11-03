import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class WorkOrderClosedViewContentComponent extends Component {
  @service browser;

  get imageUrl() {
    return this.args.model.get('invoice.receipt.url');
  }

  @action
  openBrowser() {
    if (this.imageUrl) {
      this.browser.open({
        url: this.imageUrl,
        presentationStyle: 'popover',
      });
    }
  }
}
