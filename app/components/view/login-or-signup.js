import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';

export default class LoginOrSignupViewComponent extends Component {
  @service router;

  @action openSignUpViewInSystemBrowser() {
    Browser.open({
      url: `https://app.houseninja.co/signup/`,
      presentationStyle: 'popover',
    });
  }

  @action login() {
    this.router.transitionTo('login');
  }
}
