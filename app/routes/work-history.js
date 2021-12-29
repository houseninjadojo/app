import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkHistoryRoute extends Route {
  @service store;
}
