import BaseSessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import { SplashScreen } from '@capacitor/splash-screen';
import Sentry from 'houseninja/utils/sentry';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { startSpan, captureException } from 'houseninja/utils/sentry';

import type MetricsService from 'houseninja/services/metrics';
import type CurrentService from 'houseninja/services/current';
import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';
import type Transition from '@ember/routing/transition';

/**
 * @see https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/services/session.js
 */
export default class SessionService extends BaseSessionService {
  @service declare metrics: MetricsService;
  @service declare current: CurrentService;
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
    startSpan({
      op: 'session.setup',
      description: 'session setup',
    })?.finish();
    Sentry.addBreadcrumb({
      category: 'session.setup',
      message: 'session setup invoked',
    });
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
    startSpan({
      op: 'session.terminate',
      description: 'session terminate',
    })?.finish();

    if (isNativePlatform()) {
      SplashScreen.show({
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

    await this.metrics.trackEvent({ event: 'Logout' });
    await this.invalidate();
    await this.metrics.reset();
    await this._closeBrowser();
    this.router.transitionTo('index');
  }

  async _closeBrowser(): Promise<void> {
    if (isNativePlatform()) {
      const span = startSpan({
        op: 'browser.close',
        description: 'CLOSE',
      });

      Sentry.addBreadcrumb({
        type: 'ui',
        category: 'browser.close',
        message: 'closing browser',
        level: 'info',
      });

      try {
        Browser.removeAllListeners();
        await Browser.close();
        span?.setStatus('success');
      } catch (e) {
        span?.setStatus('error');
        captureException(e as Error);
      } finally {
        await SplashScreen.hide();
        span?.finish();
      }
    }
  }
}
