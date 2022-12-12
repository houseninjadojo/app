import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from 'houseninja/config/environment';
import { AuthRoute, OnboardingRoute } from 'houseninja/data/enums/routes';
import { runTask } from 'ember-lifeline';
import BrowserService from 'houseninja/services/browser';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';

export default class LoginOrSignupViewComponent extends Component {
  @service declare browser: BrowserService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  @action
  async openSignUpViewInSystemBrowser(): Promise<void> {
    await this.browser.open({
      url: `${ENV.appHost}/signup`,
      presentationStyle: 'popover',
    });
  }

  @action
  onboardUser(): void {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(OnboardingRoute.ContactInfo);
  }

  @action
  login(): void {
    this.router.transitionTo(AuthRoute.Login);
  }

  @action
  show(e: HTMLElement): void {
    runTask(
      this,
      () => {
        e.classList.add('show');
      },
      500
    );
  }
}
