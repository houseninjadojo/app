import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SettingsPaymentRoute extends Route {
  @service store;
}
