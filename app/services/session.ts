import BaseSessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';
import { Browser } from '@capacitor/browser';
import { SplashScreen } from '@capacitor/splash-screen';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import Sentry, { startSpan, captureException } from 'houseninja/utils/sentry';

import type AnalyticsService from 'houseninja/services/analytics';
import type CurrentService from 'houseninja/services/current';
import type IntercomService from 'houseninja/services/intercom';
import type RouterService from '@ember/routing/router-service';
import type StoreService from '@ember-data/store';

/**
 * @see https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/services/session.js
 */
export default class SessionService extends BaseSessionService {
  @service declare analytics: AnalyticsService;
  @service declare current: CurrentService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare store: StoreService;

  async handleAuthentication(routerAfterAuthentication: string): Promise<void> {
    if (this.data?.authenticated?.kind === 'payment-approval') {
      Sentry.addBreadcrumb({
        category: 'session',
        message: 'skipping payment-approval authentication',
        level: 'info',
      });
      return;
    }
    super.handleAuthentication(routerAfterAuthentication);
    await this.loadIfPKCE();
  }

  async setup(): Promise<void> {
    startSpan({
      op: 'session.setup',
      description: 'session setup',
    })?.finish();
    Sentry.addBreadcrumb({
      category: 'session',
      message: 'session setup invoked',
      level: 'info',
    });
    await super.setup();
    await this.loadIfPKCE();
  }

  get authenticatedHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.data?.authenticated?.access_token}`,
    };
  }

  async loadIfPKCE(): Promise<void> {
    if (this.data?.authenticated?.authenticator === 'authenticator:pkce') {
      try {
        this.current.loadIdentifyAndTrack.perform();
      } catch (err) {
        await this.invalidate();
      }
    }
  }

  async terminate(transition = null): Promise<void> {
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

    await this.analytics.track('Logout');
    await this.invalidate();
    await this.analytics.reset();
    await this.intercom.logout();
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
        category: 'session',
        message: 'closing browser',
        level: 'info',
      });

      try {
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
