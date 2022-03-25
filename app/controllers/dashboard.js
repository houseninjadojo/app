import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DashboardIndexController extends Controller {
  @tracked isLoading = true;

  @action
  toggleLoading() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3750);
  }
}
