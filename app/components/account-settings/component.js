import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AccountSettingsComponent extends Component {
  @service router;

  /**
   * The current route selection
   */
    
  menuItems = [
    {
        label: 'Home',
        name: 'home',
    },
    {
        label: 'Contact Information',
        name: 'contact',
    },
    {
        label: 'Payment Method',
        name: 'payment',
    },
    {
        label: 'Security Settings',
        name: 'security',
    },
    {        
        label: 'Property Details',
        name: 'property',
    },
    {
        label: 'Contact Us',
        name: 'contact',
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
    // this.router.transitionTo(routeName);
  }
}
