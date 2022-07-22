import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { set } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default class ViewService extends Service {
  @service router;

  @tracked history = {
    preserveredScrollPosition: null,
    preservedPreviousRoute: [],
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
    const newHistory = [
      ...this.history.preservedPreviousRoute,
      { name, params },
    ];
    set(this.history, 'preservedPreviousRoute', newHistory);
  }

  @action
  transitionToPreviousRoute() {
    const previousRoute = this.history.preservedPreviousRoute.pop();
    const { name, params } = previousRoute || {};

    if (!name || !params) {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    } else if (Object.keys(params).length && name) {
      // @todo There's got to be a better way to pass the an >1 paramter values, but I can't figure it out.
      this.router.transitionTo(name, Object.values(params)[0]);
    } else if (name) {
      this.router.transitionTo(name);
    }
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
