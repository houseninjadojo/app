import Component from '@glimmer/component';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';
import { service } from '@ember/service';
import { SignupRoute } from 'houseninja/data/enums/routes';
import RouterService from '@ember/routing/router-service';

export default class SignUpComponent extends Component {
  @service declare router: RouterService;

  get showPromoBanner(): boolean {
    switch (this.router.currentRoute.name) {
      case SignupRoute.Index:
      case SignupRoute.AreaNotification:
      case SignupRoute.PlanSelection:
      case SignupRoute.ContactInfo:
      case SignupRoute.PaymentMethod:
        return true;
      default:
        return false;
    }
  }

  breadcrumbs = breadcrumbs;
}
