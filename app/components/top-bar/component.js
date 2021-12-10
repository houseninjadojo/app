import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NavBarComponent extends Component {
  @service router;
  @tracked modalVisible = false;

  @action
  toggleSettingsViewVisibility() {
    console.log('Toggle Settings Modal Visibility');
    this.router.transitionTo('settings');
  }
}
