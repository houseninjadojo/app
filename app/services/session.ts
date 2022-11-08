import BaseSessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';
import { SplashScreen } from '@capacitor/splash-screen';
import Sentry from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { startSpan } from 'houseninja/utils/sentry';
import { debug } from '@ember/debug';
import { datadogRum } from '@datadog/browser-rum';

import type BrowserService from 'houseninja/services/browser';
import type EventBusService from 'houseninja/services/event-bus';
import type MetricsService from 'houseninja/services/metrics';
import type CurrentService from 'houseninja/services/current';
import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type { Span } from '@sentry/types';

/**
 * @see https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/services/session.js
 */
export default class SessionService extends BaseSessionService {
  @service declare browser: BrowserService;
  @service declare metrics: MetricsService;
  @service declare current: CurrentService;
  @service declare eventBus: EventBusService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  async handleAuthentication(routeAfterAuthentication: string): Promise<void> {
    if (this.data?.authenticated.kind === 'payment-approval') {
      Sentry.addBreadcrumb({
        category: 'session.authentication.handler',
        message: 'skipping payment-approval authentication',
      });
      return;
    }
    super.handleAuthentication(routeAfterAuthentication);
    await this.loadIfPKCE();
  }

  async setup(): Promise<void> {
    this.logSentry('setup');
    await super.setup();
    await this.loadIfPKCE();
  }

  get authenticatedHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.data?.authenticated.access_token}`,
    };
  }

  async loadIfPKCE(): Promise<void> {
    if (this.data?.authenticated.authenticator === 'authenticator:pkce') {
      try {
        this.current.loadIdentifyAndTrack.perform();
      } catch (err) {
        await this.invalidate();
      }
    }
  }

  async terminate(transition?: Transition): Promise<void> {
    this.logSentry('terminate');
    if (isNativePlatform()) {
      await SplashScreen.show({
        fadeInDuration: 0,
        fadeOutDuration: 1000,
        showDuration: 1000,
        autoHide: false,
      });
    }
    if (transition) {
      this.requireAuthentication(
        transition,
        NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP
      );
    }
    await super.invalidate();
    this.router.transitionTo('index');
  }

  async invalidate(): Promise<void> {
    this.logSentry('invalidate', 'logging out');
    if (isNativePlatform()) {
      await SplashScreen.show({
        fadeInDuration: 0,
        fadeOutDuration: 1000,
        showDuration: 1000,
        autoHide: false,
      });
    }
    await super.invalidate();
  }

  async handleInvalidation(routeAfterInvalidation: string): Promise<void> {
    datadogRum.clearUser();
    await this.metrics.trackEvent({ event: 'Logout' });
    await this.metrics.reset();
    await this.browser.close();
    await SplashScreen.hide();
    const redirection =
      routeAfterInvalidation ?? NATIVE_MOBILE_ROUTE.AUTH.LOGIN_OR_SIGNUP;
    this.router.transitionTo(redirection);
  }

  // eslint-disable-next-line prettier/prettier
  private logSentry(action: string, message?: string, type?: string, finish = true): Span | void {
    debug(`[session] ${action} ${message ?? ''}`);
    const tag = action.includes('.') ? action : `session.${action}`;
    const msg = message ?? `${action} session`;
    const span = startSpan({
      op: tag,
      description: msg,
    });
    Sentry.addBreadcrumb({
      type,
      category: tag,
      message: msg,
      level: 'info',
    });
    if (finish) {
      span?.finish();
      return;
    } else {
      return span;
    }
  }
}
