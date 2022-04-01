import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';

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
        this.router.transitionTo('vault.group', this.args.model.groupId);
      } else {
        this.router.transitionTo('vault');
      }
    }
    if (route === 'edit') {
      // edit document
      this.router.transitionTo('vault.file.edit', this.args.model.id);
    }
  }
}
