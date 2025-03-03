import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class ApplicationController extends Controller {
  @tracked showLoader: boolean = isNativePlatform();

  @action
  toggleLoading(): void {
    this.showLoader = false;
  }
}
