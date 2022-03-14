import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';

export default class ViewService extends Service {
  @tracked history = {
    preserveredScrollPosition: null,
    preservedPreviousRoute: null,
  };

  elSelector = 'main.hn.view';

  @action
  preserveViewScrollPosition(router) {
    const mainView = document.querySelector(this.elSelector);
    const position = mainView && mainView.scrollTop;

    if (position) {
      set(this.history, 'preserveredScrollPosition', {
        route: router.currentRouteName,
        position,
      });
    }
  }

  @action
  preservePreviousRoute(router) {
    const { name, params } = router.currentRoute;

    set(this.history, 'preservedPreviousRoute', { name, params });
  }

  @action
  applyPreservedScrollPosition(router) {
    if (this.history.preserveredScrollPosition) {
      const mainView = document.querySelector(this.elSelector);
      const preserveredScrollPosition = this.history.preserveredScrollPosition;

      if (
        mainView &&
        preserveredScrollPosition.route === router.currentRouteName
      ) {
        mainView.scrollTop = preserveredScrollPosition.position;
      }

      set(this.history, 'preserveredScrollPosition', null);
    }
  }
}
