import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked errorMessage;
  @service session;

  @action
  async authenticate(e) {
    e.preventDefault();
    let { username, password } = this;
    let creds = { username, password };
    try {
      await this.session.authenticate('authenticator:jwt', creds);
    } catch (error) {
      console.log(error);
      this.errorMessage = error.error || error;
    }

    if (this.session.isAuthenticated) {
      // What to do with all this success?
    }
  }

  @action
  updateUsername(e) {
    this.username = e.target.value;
  }

  @action
  updatePassword(e) {
    this.password = e.target.value;
  }
}
