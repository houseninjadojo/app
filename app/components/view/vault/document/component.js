import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import ENV from 'houseninja/config/environment';

export default class VaultDocumentComponent extends Component {
  @service router;

  @action
  openBrowser() {
    if (this.args.model) {
      Browser.open({
        windowName: this.args.model.name || this.args.model.uri,
        url: `${ENV.appHost}/${this.args.model.uri}`,
        // url: this.args.model.uri,
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
