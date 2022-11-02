import Service, { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { debug } from '@ember/debug';
import BranchWeb from 'branch-sdk';
import Sentry, { captureException } from 'houseninja/utils/sentry';
import ENV from 'houseninja/config/environment';
// import { isEqual, compare } from '@ember/utils';

/**
 * This service registers a listener to pick up incoming deep links.
 * Our app registers the deep link scheme `co.houseninja.application://`.
 *
 * This service listens to a deep link call to open our app, then
 * translates the request and forwards it to the ember router.
 *
 * In this way, both web native route requests (https://app.houseninja.co/some-page?query=param)
 * and mobile native route requests (co.houseninja.application://some-page?query=param)
 * are routed the same way.
 */
export default class DeepLinksService extends Service {
  @service eventBus;
  @service router;
  @service metrics;
  @service session;

  listener = null;

  start() {
    if (isNativePlatform()) {
      // @todo figure out why this takes precedence over branch
      this.setupRouteHandler();
      this.setupBranchHandlers();
    }
  }

  stop() {
    this.listener = null;
    this.branchListener = null;
    this.branchErrorListener = null;
  }

  // only web for now
  setup() {
    if (!isNativePlatform()) {
      this.setupWebHandler();
    }
  }

  forwardRoute(url) {
    debug('url: ' + url.name);
    debug('options: ' + JSON.stringify(url.options));
    debug('raw: ' + url.raw);
    let route = this.router.recognize(url.raw);
    debug('route: ' + route.name);
    // console.log(route);

    if (route?.name === 'login.callback') {
      this.router.transitionTo(url.raw);
    }

    if (route) {
      // this.router.transitionTo(route.name, route.params);
      this.router.transitionTo(url.raw);
    }
  }

  parseUrl(url) {
    let parsed = new URL(url);
    let queryParams = Object.fromEntries(parsed.searchParams.entries());
    let pathName =
      parsed.hash.length > 0 ? parsed.hash.replace('#', '') : parsed.pathname;
    return {
      raw: `${pathName}${parsed.search}`,
      name: pathName,
      model: null, // perhaps later
      options: {
        queryParams,
      },
    };
  }

  setupRouteHandler() {
    this.eventBus.on('app.app-url-open', (event) => {
      const transaction = Sentry.getCurrentHub().getScope().getTransaction();
      let span;
      if (transaction) {
        span = transaction.startChild({
          op: 'mobile.deep-link.event',
          description: `Received appUrlOpen: ${event?.url}`,
        });
      }
      if (!this.isNonBranchLink(event)) {
        span?.setTag('branch-link', true);
        span?.finish();
        return;
      }
      span?.setTag('branch-link', false);
      span?.setTag('url', event?.url);
      span?.finish();
      debug('non branch url: ' + event.url);
      Sentry.addBreadcrumb({
        type: 'user',
        category: 'deep-link.open',
        message: 'deep link',
        data: event,
      });
      const url = this.parseUrl(event.url);
      this.forwardRoute(url);
    });
  }

  /**
   * Listen to incoming branch links forwarded on by their
   * capacitor plugin.
   *
   * @see https://help.branch.io/developers-hub/docs/capacitor#initialize-branch
   */
  setupBranchHandlers() {
    this.branchListener = this.eventBus.on('branch.init', (event) => {
      if (this.isNonBranchLink(event)) {
        return;
      }
      debug('Opened with Branch Link');
      const referringParams = event.referringParams;
      this.metrics.trackEvent({
        event: 'Opened with Deep Link',
        properties: { referringParams },
      });
      Sentry.addBreadcrumb({
        type: 'user',
        category: 'deep-link.open',
        message: 'Branch deep link',
        data: event,
      });
      // Retrieve deeplink keys from 'referringParams' and evaluate the values to determine where to route the user
      // Check '+clicked_branch_link' before deciding whether to use your Branch routing logic
      const route = this.selectRouteFromBranchParams(referringParams);
      this.forwardRoute({ raw: route, name: route });
    });
    this.branchErrorListener = this.eventBus.on(
      'branch.init-error',
      (error) => {
        if (typeof error === 'string') {
          error = new Error(error);
          captureException(error);
        }
      }
    );
  }

  setupWebHandler() {
    BranchWeb.init(ENV.branch.key, (err, data) => {
      if (err) {
        captureException(err);
      } else {
        this.metrics.trackEvent({
          event: 'Opened with Web Link',
          properties: data.data_parsed,
        });
        Sentry.addBreadcrumb({
          type: 'user',
          category: 'deep-link.open',
          message: 'Branch web link',
          data,
        });
      }
    });
  }

  /**
   * @example {params}
   * {
   *   "~campaign": "asdf",
   *   "~referring_link": "https://w.hnja.io/asdf",
   *   "~id": 1038724433047185200,
   *   "~tags": ["asdf"],
   *   "$marketing_title": "asdf",
   *   "$og_description": "",
   *   "~marketing": true,
   *   "~feature": "asdf",
   *   "+match_guaranteed": true,
   *   "+click_timestamp": 1648891154,
   *   "~creation_source": 1,
   *   "$deeplink_path": "/",
   *   "~channel": "asdf",
   *   "$one_time_use": false,
   *   "$desktop_url": "https://app.houseninja.co",
   *   "+clicked_branch_link": true,
   *   "$og_title": "House Ninja",
   *   "+is_first_session": false,
   *   "$canonical_url": "https://app.houseninja.co"
   * }
   */
  selectRouteFromBranchParams(params) {
    let path = '/';
    if (params.$deeplink_path) {
      path = params.$deeplink_path;
    }
    return path;
  }

  isNonBranchLink(event) {
    return (
      event?.referringParams === undefined ||
      (typeof event?.referringParams === 'object' &&
        Object.keys(event?.referringParams).length === 0)
    );
  }
}
