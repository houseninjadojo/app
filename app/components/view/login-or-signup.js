import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginOrSignupViewComponent extends Component {
  @service router;

  @action openSignUpViewInSystemBrowser() {
    window.open('/#/signup', '_system');
  }

  @action login() {
    this.router.transitionTo('login');
  }
}
