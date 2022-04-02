import Service, { service } from '@ember/service';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { App as MobileApp } from '@capacitor/app';
import { debug } from '@ember/debug';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
import BranchWeb from 'branch-sdk';
import * as Sentry from '@sentry/ember';
import ENV from 'houseninja/config/environment';

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
    // } else {
    //   this.setupWebHandler();
    // }
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
    debug('url: ', url);
    let route = this.router.recognize(url);
    debug('route: ' + route.name);
    this.router.transitionTo(url);
  }

  parseUrl(url) {
    let parsed = new URL(url);
    let queryParams = Object.fromEntries(parsed.searchParams.entries());
    debug('deep link queryParams: ' + queryParams);
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
      debug(`tried to open non-branch deep link: ${event.url}`);
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
      this.forwardRoute(route);
    });
    this.branchErrorListener = BranchDeepLinks.addListener(
      'initError',
      (error) => {
        Sentry.captureException(error);
      }
    );
  }

  setupWebHandler() {
    BranchWeb.init(ENV.branch.key, (err, data) => {
      if (err) {
        Sentry.captureException(err);
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
    const path = params.$deeplink_path;
    return path;
  }
}
