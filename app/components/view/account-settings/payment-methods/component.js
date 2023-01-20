import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class AccountSettingsPaymentMethodsComponent extends Component {
  @service router;
  @service view;

  @action
  selectRoute(id = null) {
    this.view.preservePreviousRoute(this.router);
    if (id) {
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT_METHODS.PAYMENT_METHOD.EDIT,
        // 'settings.payment-methods.payment-method.edit',
        id
      );
    } else {
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT_METHODS.NEW
      );
    }
  }

  get menuItems() {
    const defaultPaymentMethod = this.args.model?.filter((p) => p.isDefault)[0];
    const remainingPaymentMethod = this.args.model?.filter((p) => !p.isDefault);

    return [defaultPaymentMethod, ...remainingPaymentMethod];
  }
}
