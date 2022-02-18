import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AccountSettingsComponent extends Component {
  @service router;
  @service current;

  @tracked userHasPromoCode = this.current.user.get('promoCode.code');

  /**
   * The current route selection
   */

  menuItems = [
    {
      label: 'Home',
      name: 'dashboard.home',
    },
    {
      label: 'Contact Information',
      name: 'settings.contact',
    },
    {
      label: 'Payment Method',
      name: 'settings.payment',
    },
    {
      label: 'Security Settings',
      name: 'settings.security',
    },
    {
      label: 'Property Details',
      name: 'settings.property',
    },
    {
      label: 'Contact Us',
      name: 'contact-us',
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
    console.log(routeName);
    // this.selected = routeName;
    this.router.transitionTo(routeName);
  }
}
