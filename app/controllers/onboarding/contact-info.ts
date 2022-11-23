import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OnboardingContactInfoController extends Controller {
  @tracked showDialog = false;

  @action
  toggleModal(): void {
    this.showDialog = !this.showDialog;
  }
}
