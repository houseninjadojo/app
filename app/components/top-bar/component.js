import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopBarComponent extends Component {
  @service router;

  preserveViewScrollPosition() {
    const mainView = document.querySelector('main.hn.view');
    const position = mainView.scrollTop;
    localStorage.setItem(
      'preserveredScrollPosition',
      JSON.stringify({ route: this.router.currentRouteName, position })
    );
  }

  preservePreviousRoute() {
    localStorage.setItem(
      'preservedPreviousRoute',
      this.router.currentRouteName
    );
  }

  @action
  toggleSettingsViewVisibility() {
    this.preserveViewScrollPosition();
    this.preservePreviousRoute();

    this.router.transitionTo('settings');
  }
}
