import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from 'houseninja/config/environment';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { runTask } from 'ember-lifeline';
import BrowserService from 'houseninja/services/browser';
import RouterService from '@ember/routing/router-service';
import ViewService from 'houseninja/services/view';

export default class LoginOrSignupViewComponent extends Component {
  @service declare browser: BrowserService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  @action
  async openSignUpViewInSystemBrowser() {
    await this.browser.open({
      url: `${ENV.appHost}/signup`,
      presentationStyle: 'popover',
    });
  }

  @action
  onboardUser() {
    this.view.preservePreviousRoute(this.router);
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.ONBOARDING.CONTACT_INFO);
  }

  @action
  login() {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN);
  }

  @action
  show(e: HTMLElement) {
    runTask(
      this,
      () => {
        e.classList.add('show');
      },
      500
    );
  }
}
