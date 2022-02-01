import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import Sentry from '@sentry/capacitor';

export default class ApplicationRoute extends Route {
  @service current;
  @service session;
  @service router;
  @service analytics;
  @service('ember-user-activity@user-activity') userActivity;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      this._trackPage.perform();
    });

    this.userActivity.on('touchstart', this, (event) => {
      this._trackClick.perform(event);
    });
  }

  beforeModel() {
    this.generalSetup.perform();
  }

  afterModel() {
    // this.postAuthSetup.perform();
  }

  @task *generalSetup() {
    yield this.session.setup();
    yield this.analytics.setup.perform();
    yield this.current.load();
    yield this.postAuthSetup.perform();
  }

  @task *postAuthSetup() {
    yield this.analytics.track('application_started');
    if (this.session.isAuthenticated) {
      const { email } = this.session.data.authenticated.userinfo;
      Sentry.setUser({ email });
      yield this.analytics.identify(email);
      yield this.current.registerDeviceToUser.perform();
    }
  }

  @task({ enqueue: true })
  *_trackPage() {
    const page = this.router.currentURL;
    const title = this.router.currentRouteName || 'unknown';
    yield this.analytics.track('page_visit', { page, title });
  }

  /**
   * For every click or touchevent, generate a query selector
   * from the triggering DOM element and create an analytics event.
   * <div id="a" class="b c"></div> => `div.b.c#a`
   */
  @task({ enqueue: true })
  *_trackClick(event) {
    const tag = event.target.localName;
    const classNames = event.target.className.replaceAll(' ', '.');
    const id = event.target.id;
    const queryString = `${tag}.${classNames}${id.length > 0 ? '#' + id : ''}`;
    yield this.analytics.track('click', {
      selector: queryString,
    });
  }
}
