import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { APP_STORE_URL } from 'houseninja/data/app';
import RouterService from '@ember/routing/router-service';
import SessionService from 'houseninja/services/session';
import ViewService from 'houseninja/services/view';

type Args = {
  isOnboardingViaNativeApp: boolean;
};

export default class BookingConfirmationComponent extends Component<Args> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare view: ViewService;

  get showLoginButton(): boolean {
    return this.args.isOnboardingViaNativeApp && !this.session.isAuthenticated;
  }

  get showBackToDashboardButton(): boolean {
    return this.args.isOnboardingViaNativeApp && this.session.isAuthenticated;
  }

  @action
  selectRoute(route: string): void {
    if (this.args.isOnboardingViaNativeApp) {
      this.view.history.preservedPreviousRoute.pop();
    }
    this.router.transitionTo(route);
  }

  @action
  downloadFromAppStore(): void {
    window.open(APP_STORE_URL, '_blank');
  }
}
