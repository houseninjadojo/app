import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class VaultGroupComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  get getEmptyMessage() {
    return {
      message: 'You have no ' + this.args.model.name + ' documents.',
      action: 'Upload Document',
    };
  }

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();

    if (route === 'edit') {
      // edit group
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.VAULT.GROUP.EDIT,
        this.args.model.id
      );
    }
    if (typeof route === 'object') {
      if (route.contentType) {
        // view document
        this.router.transitionTo(
          NATIVE_MOBILE_ROUTE.VAULT.DOCUMENT.INDEX,
          route.id
        );
      }
    }

    this.view.preservePreviousRoute(this.router);
  }
}
