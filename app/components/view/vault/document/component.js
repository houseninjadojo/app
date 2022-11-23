import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultDocumentComponent extends Component {
  @service browser;
  @service router;
  @service view;

  @action
  openBrowser() {
    if (this.args.model) {
      this.browser.open({
        url: `${this.args.model.url}`,
        presentationStyle: 'popover',
      });
    }
  }

  @action
  selectRoute(route) {
    if (route === 'back') {
      // transition back
      const belongsToGroup = this.args.model.group.id;
      if (belongsToGroup) {
        this.router.transitionTo(
          NATIVE_MOBILE_ROUTE.VAULT.GROUPS.SHOW,
          this.args.model.group.id
        );
      } else {
        this.router.transitionTo(NATIVE_MOBILE_ROUTE.VAULT.INDEX);
      }
    }
    if (route === 'edit') {
      // edit document
      this.view.preservePreviousRoute(this.router);
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.EDIT,
        this.args.model.id
      );
    }
  }
}
