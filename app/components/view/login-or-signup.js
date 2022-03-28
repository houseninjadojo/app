import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import ENV from 'houseninja/config/environment';

export default class LoginOrSignupViewComponent extends Component {
  @service router;

  @action openSignUpViewInSystemBrowser() {
    Browser.open({
      url: `${ENV.appHost}/signup`,
      presentationStyle: 'popover',
    });
  }

  @action login() {
    this.router.transitionTo('login');
  }

  @action show(e) {
    setTimeout(() => {
      e.classList.add('show');
    }, 500);
  }
}
