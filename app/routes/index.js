import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default class IndexRoute extends Route {
  @service session;

  @alias('session.isAuthenticated') isAuthenticated;
}
