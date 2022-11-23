import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

import type ViewService from 'houseninja/services/view';

export default class FaqController extends Controller {
  @service declare view: ViewService;

  @action
  selectRoute() {
    this.view.preservePreviousRoute();
  }
}
