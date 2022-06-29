import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';

export default class WorkOrderClosedViewContentComponent extends Component {
  get imageUrl() {
    return this.args.model.get('invoice').get('document').url;
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
