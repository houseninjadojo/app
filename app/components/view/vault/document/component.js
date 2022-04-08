import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultDocumentComponent extends Component {
  @service router;

  @action
  openBrowser() {
    if (this.args.model) {
      Browser.open({
        url: `${this.args.model.url}`,
        presentationStyle: 'popover',
      });
    }
  }

  @action
  selectRoute(route) {
    if (route === 'back') {
      // transition back
      const belongsToGroup = this.args.model.groupId;
      if (belongsToGroup) {
        this.router.transitionTo(
          NATIVE_MOBILE_ROUTE.VAULT.GROUP.INDEX,
          this.args.model.groupId
        );
      } else {
        this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
      }
    }
    if (route === 'edit') {
      // edit document
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.DOCUMENT.EDIT,
        this.args.model.id
      );
    }
  }
}
