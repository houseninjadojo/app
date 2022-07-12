import Component from '@glimmer/component';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';
import { service } from '@ember/service';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';
export default class SignUpComponent extends Component {
  @service router;

  get showPromoBanner() {
    switch (this.router.currentRoute.name) {
      case SIGNUP_ROUTE.INDEX:
      case SIGNUP_ROUTE.AREA_NOTIFICATION:
      case SIGNUP_ROUTE.PLAN_NOTIFICATION:
      case SIGNUP_ROUTE.CONTACT_INFO:
      case SIGNUP_ROUTE.PAYMENT_METHOD:
        return true;
      default:
        return false;
    }
  }

  breadcrumbs = breadcrumbs;
}
