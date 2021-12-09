import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NavBarComponent extends Component {
  @tracked modalVisible = false;

  @action
  toggleSettingsViewVisibility() {
    console.log('Toggle Settings Modal Visibility');
  }
}
