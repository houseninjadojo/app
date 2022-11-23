import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';

export default class PreventativeMaintenanceThumbnailComponent extends Component {
  @service browser;
  @service store;
  @tracked dialogIsVisible = false;

  @action
  toggleDialog() {
    this.dialogIsVisible = !this.dialogIsVisible;
  }

  async prevantativeMaintenanceReport() {
    return await this.store.queryRecord('document', {
      filter: {
        tags: ['system:preventative-maintenance-plan'],
      },
    });
  }

  @action
  async openBrowser() {
    const doc = await this.prevantativeMaintenanceReport();

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
