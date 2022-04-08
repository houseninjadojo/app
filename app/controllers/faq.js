import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class FaqController extends Controller {
  @service view

  @action
  selectRoute() {
    this.view.preservePreviousRoute();
  }
}
