import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class GlobalComponent extends Component {
  @service loader;
  get loading() {
    return this.loader.isLoading;
  }
}
