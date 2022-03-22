import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { vault } from 'houseninja/data/document-stub';

export default class PreventativeMaintenanceThumbnailComponent extends Component {
  @action
  openBrowser() {
    const doc = vault.documentStub.filter((d) => d.isPMCalendar)[0];
    const uri = (doc && doc.uri) || null;

    if (uri) {
      Browser.open({
        url: uri,
        presentationStyle: 'popover',
      });
    }
  }
}
