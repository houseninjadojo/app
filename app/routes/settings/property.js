import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsPropertyRoute extends Route {
  @service store;
}
