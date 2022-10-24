import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { set } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import type RouterService from '@ember/routing/router-service';

interface PreservedPreviousRoute {
  name: string;
  params: { [key: string]: string | undefined };
}

interface PreservedScrollPosition {
  route?: string;
  position?: number;
}

interface History {
  preservedScrollPosition: PreservedScrollPosition;
  preservedPreviousRoute: Array<PreservedPreviousRoute>;
}

export default class ViewService extends Service {
  @service declare router: RouterService;

  @tracked history: History = {
    preservedScrollPosition: {},
    preservedPreviousRoute: [],
  };

  elSelector = 'main.hn.view';

  @action
  preserveViewScrollPosition(router: RouterService): void {
    const mainView: Element | null = document.querySelector(this.elSelector);
    const position = mainView && mainView.scrollTop;

    if (position) {
      set(this.history, 'preservedScrollPosition', {
        route: router.currentRouteName,
        position,
      });
    }
  }

  @action
  preservePreviousRoute(router: RouterService): void {
    const { name, params } = router.currentRoute;
    const newHistory = [
      ...this.history.preservedPreviousRoute,
      { name, params },
    ];
    set(this.history, 'preservedPreviousRoute', newHistory);
  }

  @action
  transitionToPreviousRoute(): void {
    const previousRoute: PreservedPreviousRoute | undefined =
      this.history.preservedPreviousRoute.pop();
    const { name, params } = previousRoute || {};

    if (!name || !params) {
      this.router.transitionTo(NATIVE_MOBILE_ROUTE.DASHBOARD.HOME);
    } else if (Object.keys(params).length && name) {
      // @todo There's got to be a better way to pass the an >1 paramter values, but I can't figure it out.
      this.router.transitionTo(name, { queryParams: params });
    } else if (name) {
      this.router.transitionTo(name);
    }
  }

  @action
  applyPreservedScrollPosition(router: RouterService): void {
    if (this.history.preservedScrollPosition) {
      const mainView: Element | null = document.querySelector(this.elSelector);
      const preservedScrollPosition: PreservedScrollPosition =
        this.history.preservedScrollPosition;

      if (
        mainView &&
        preservedScrollPosition.route === router.currentRouteName
      ) {
        mainView.scrollTop = preservedScrollPosition.position as number;
      }

      set(this.history, 'preservedScrollPosition', {});
    }
  }
}
