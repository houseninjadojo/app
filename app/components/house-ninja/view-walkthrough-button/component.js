import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Browser } from '@capacitor/browser';
import { isPresent } from '@ember/utils';

export default class ViewWalkthroughButtonComponent extends Component {
  @service store;
  @tracked dialogIsVisible = false;

  @action
  toggleDialog() {
    this.dialogIsVisible = !this.dialogIsVisible;
  }

  async walkthroughReport() {
    return await this.store.queryRecord('document', {
      filter: {
        tags: ['system:walkthrough-report'],
      },
    });
  }

  @action
  async openBrowser() {
    const doc = await this.walkthroughReport();

    if (isPresent(doc) && isPresent(doc.url)) {
      await Browser.open({
        url: doc.url,
        presentationStyle: 'popover',
      });
    } else {
      this.toggleDialog();
    }
  }
}
