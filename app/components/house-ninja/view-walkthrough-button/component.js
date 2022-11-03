import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';

export default class ViewWalkthroughButtonComponent extends Component {
  @service browser;
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
      await this.browser.open({
        url: doc.url,
        presentationStyle: 'popover',
      });
    } else {
      this.toggleDialog();
    }
  }
}
