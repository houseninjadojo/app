import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class SettingsRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(
      transition,
      NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
    );
  }
}
