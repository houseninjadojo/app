import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { isPresent } from '@ember/utils';

export default class ViewWalkthroughButtonComponent extends Component {
  @service store;

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
    }
  }
}
