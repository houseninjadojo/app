import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DashboardHandleItRoute extends Route {
  @service store;
}
