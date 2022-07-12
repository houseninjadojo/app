import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Browser } from '@capacitor/browser';
import { isPresent } from '@ember/utils';

export default class PreventativeMaintenanceThumbnailComponent extends Component {
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
      await Browser.open({
        url: doc.url,
        presentationStyle: 'popover',
      });
    } else {
      this.toggleDialog();
    }
  }
}
