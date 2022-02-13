import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('dashboard.home');
  }
}
