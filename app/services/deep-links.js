import Service, { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { App as MobileApp } from '@capacitor/app';
import { debug } from '@ember/debug';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
import BranchWeb from 'branch-sdk';
import Sentry, { captureException } from 'houseninja/utils/sentry';
import ENV from 'houseninja/config/environment';
import { isEqual } from '@ember/utils';

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
  @service router;
  @service analytics;

  listener = null;

  start() {
    if (isNativePlatform()) {
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
    let route = this.router.recognize(url.name);
    debug('route: ' + route.name);
    this.router.transitionTo(url.raw);
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
    this.listener = MobileApp.addListener('appUrlOpen', (event) => {
      debug('non branch url: ' + event.url);
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
    this.branchListener = BranchDeepLinks.addListener('init', (event) => {
      if (this.isNonBranchLink(event)) {
        return;
      }
      const referringParams = event.referringParams;
      this.analytics.track('Opened with Deep Link', referringParams);
      Sentry.addBreadcrumb({
        category: 'deep-link',
        message: 'Branch deep link',
        data: event,
        level: 'info',
      });
      // Retrieve deeplink keys from 'referringParams' and evaluate the values to determine where to route the user
      // Check '+clicked_branch_link' before deciding whether to use your Branch routing logic
      const route = this.selectRouteFromBranchParams(referringParams);
      this.forwardRoute({ raw: route });
    });
    this.branchErrorListener = BranchDeepLinks.addListener(
      'initError',
      (error) => {
        captureException(error);
      }
    );
  }

  setupWebHandler() {
    BranchWeb.init(ENV.branch.key, (err, data) => {
      if (err) {
        captureException(err);
      } else {
        this.analytics.track('Opened with Web Link', data.data_parsed);
        Sentry.addBreadcrumb({
          category: 'web-link',
          message: 'Branch web link',
          data,
          level: 'info',
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
    return !isEqual(event.referringParams, {});
  }
}
