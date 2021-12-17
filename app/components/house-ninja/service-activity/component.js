import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ServiceActivityComponent extends Component {
  get getActiveTabContent() {
    return this.activeRecords.filter((r) => r.active)[0];
  }
  @action
  userHasServiceRecords(serviceRecords) {
    return serviceRecords.length > 0;
  }
}
