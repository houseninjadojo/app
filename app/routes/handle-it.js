import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HandleItRoute extends Route {
  @service store;
}
