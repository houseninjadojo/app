import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import ENV from 'houseninja/config/environment';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class LoginOrSignupViewComponent extends Component {
  @service router;

  @action openSignUpViewInSystemBrowser() {
    Browser.open({
      url: `${ENV.appHost}/signup`,
      presentationStyle: 'popover',
    });
  }

  @action login() {
    this.router.transitionTo(NATIVE_MOBILE_ROUTE.AUTH.LOGIN);
  }

  @action show(e) {
    setTimeout(() => {
      e.classList.add('show');
    }, 500);
  }
}
