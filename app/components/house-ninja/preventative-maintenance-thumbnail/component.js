import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { isPresent } from '@ember/utils';

export default class PreventativeMaintenanceThumbnailComponent extends Component {
  @service store;

  async prevantativeMaintenanceReport() {
    return await this.store.queryRecord('document', {
      filter: {
        tags: ['system:preventative-maintenance-report'],
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
    }
  }
}
