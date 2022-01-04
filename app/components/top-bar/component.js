import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NavBarComponent extends Component {
  @service router;

  @action
  toggleSettingsViewVisibility() {
    const mainView = document.querySelector('main.hn.view');
    const position = mainView.scrollTop;
    localStorage.setItem(
      'preserveredScrollPosition',
      JSON.stringify({ route: this.router.currentRouteName, position })
    );

    this.router.transitionTo('settings');
  }
}
