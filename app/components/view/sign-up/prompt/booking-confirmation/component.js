import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class BookingConfirmationComponent extends Component {
  @service router;
  @service session;
  @service view;

  get showLoginButton() {
    return this.args.isOnboardingViaNativeApp && !this.session.isAuthenticated;
  }

  get showBackToDashboardButton() {
    return this.args.isOnboardingViaNativeApp && this.session.isAuthenticated;
  }

  @action
  selectRoute(route) {
    if (this.args.isOnboardingViaNativeApp) {
      this.view.history.preservedPreviousRoute.pop();
    }
    this.router.transitionTo(route);
  }
}
