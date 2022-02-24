import Component from '@glimmer/component';

export default class ServiceActivityComponent extends Component {
  get getActiveTabContent() {
    return this.activeRecords.filter((r) => r.active)[0];
  }
}
