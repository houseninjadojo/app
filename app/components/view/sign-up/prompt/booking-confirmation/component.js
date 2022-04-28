import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class BookingConfirmationComponent extends Component {
  @service router;
  @service session;

  get showLoginButton() {
    return this.args.isOnboardingViaNativeApp && !this.session.isAuthenticated;
  }
  @action
  login() {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN);
  }
}
