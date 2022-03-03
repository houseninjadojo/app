import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Intercom } from '@capacitor-community/intercom';

export default class ServiceActivityRecordsComponent extends Component {
  get getActiveTabContent() {
    return this.activeRecords.filter((r) => r.active)[0];
  }

  @action
  selectRoute(routeName) {
    console.log(routeName);
  }

  @action
  async openChatModal() {
    await Intercom.displayMessageComposer({ message: 'Help me with ' });
  }
}
