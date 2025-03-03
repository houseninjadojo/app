import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from 'houseninja/config/environment';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class LoginOrSignupViewComponent extends Component {
  @service browser;
  @service router;
  @service view;

  @action
  openSignUpViewInSystemBrowser() {
    this.browser.open({
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
  show(e) {
    setTimeout(() => {
      e.classList.add('show');
    }, 500);
  }
}
