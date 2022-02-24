import Component from '@glimmer/component';
import { action } from '@ember/object';
export default class ServiceActivityComponent extends Component {
  get getActiveTabContent() {
    return this.activeRecords.filter((r) => r.active)[0];
  }

  @action
  selectRoute(routeName) {
    console.log(routeName);
  }
}
