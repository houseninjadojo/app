import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class GlobalComponent extends Component {
  @service loader;
  @tracked isLoading = this.loader.isLoading;

  @action
  loading() {
    this.loader = this.loader.isLoading;
  }
}
