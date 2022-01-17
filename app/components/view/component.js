import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ViewComponent extends Component {
  @service router;

  @action
  applyPreservedScrollPosition() {
    if (localStorage.preserveredScrollPosition) {
      const mainView = document.querySelector('main.hn.view');
      const preserveredScrollPosition = JSON.parse(
        localStorage.getItem('preserveredScrollPosition')
      );

      if (
        mainView &&
        preserveredScrollPosition.route === this.router.currentRouteName
      ) {
        mainView.scrollTop = preserveredScrollPosition.position;
      }

      localStorage.removeItem('preserveredScrollPosition');
    }
  }
}
