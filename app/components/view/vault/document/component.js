import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { findRecord } from 'ember-data-resources';
import { tracked } from '@glimmer/tracking';

export default class VaultDocumentComponent extends Component {
  @service router;

  @tracked id = this.args.model.documentId;

  document = findRecord(this, 'document', () => this.id);

  @action
  openBrowser() {
    if (this.document) {
      Browser.open({
        url: `${this.document.record.url}`,
        presentationStyle: 'popover',
      });
    }
  }

  @action
  selectRoute(route) {
    if (route === 'back') {
      // transition back
      const belongsToGroup = this.document.record.group.id;
      if (belongsToGroup) {
        this.router.transitionTo(
          NATIVE_MOBILE_ROUTE.VAULT.GROUPS.SHOW,
          this.document.record.group.id
        );
      } else {
        this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
      }
    }
    if (route === 'edit') {
      // edit document
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.EDIT,
        this.document.record.id
      );
    }
  }
}
