import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class AccountSettingsComponent extends Component {
  @service router;
  @service view;

  @service current;

  @tracked userHasPromoCode = this.current.user.get('promoCode.code');

  /**
   * The current route selection
   */

  menuItems = [
    {
      label: 'Home',
      name: NATIVE_MOBILE_ROUTE.DASHBOARD.HOME,
    },
    {
      label: 'Document Vault',
      name: 'vault',
    },
    {
      label: 'Contact Information',
      name: NATIVE_MOBILE_ROUTE.SETTINGS.CONTACT,
    },
    {
      label: 'Payment Method',
      name: NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT,
    },
    {
      label: 'Security Settings',
      name: NATIVE_MOBILE_ROUTE.SETTINGS.SECURITY,
    },
    {
      label: 'Property Details',
      name: NATIVE_MOBILE_ROUTE.SETTINGS.PROPERTY,
    },
    {
      label: 'FAQ',
      name: 'faq',
    },
    {
      label: 'Logout',
      name: 'logout',
    },
  ];

  @action
  selectRoute(routeName) {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(routeName);
  }
}
