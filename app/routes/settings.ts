import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import { DefaultRoute } from 'houseninja/data/enums/routes';
import SessionService from 'houseninja/services/session';

export default class SettingsRoute extends Route {
  @service declare session: SessionService;

  beforeModel(transition: Transition): void {
    this.session.requireAuthentication(transition, DefaultRoute.SignedOut);
  }
}
