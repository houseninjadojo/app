import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';
import { bind } from '@ember/runloop';
import { htmlTreeAsString } from '@sentry/utils';

import type Transition from '@ember/routing/transition';
import type IntercomService from 'houseninja/services/intercom';
import type NotificationService from 'houseninja/services/notifications';
import type RouterService from '@ember/routing/router-service';
import type StorageService from 'houseninja/services/storage';
import type UserActivityService from 'ember-user-activity/addon/services/user-activity';
import type MetricsService from 'houseninja/services/metrics';
import type EventBusService from 'houseninja/services/event-bus';
import type BranchService from 'houseninja/services/branch';
import type CapacitorService from 'houseninja/services/capacitor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericService = any;

class ApplicationRoute extends Route {
  @service declare branch: BranchService;
  @service declare capacitor: CapacitorService;
  @service declare current: GenericService;
  @service declare deepLinks: GenericService;
  @service declare eventBus: EventBusService;
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare session: GenericService;
  @service declare router: RouterService;
  @service declare loader: GenericService;
  @service declare storage: StorageService;
  @service declare notifications: NotificationService;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @service('ember-user-activity@user-activity')
  declare userActivity: UserActivityService;

  constructor(properties?: object | undefined) {
    super(properties);
    this.router.on('routeDidChange', bind(this, this.trackPage));
    this.userActivity.on('touchstart', this, this.trackClick);
  }

  async beforeModel(): Promise<void> {
    await this.eventBus.setup();
    await this.capacitor.setup();
    await this.storage.setup();
    await this.intercom.setup();
    await this.session.setup();
    await this.deepLinks.setup();
    await this.notifications.setup();
    await this.branch.setup();
  }

  afterModel(): void {
    if (isNativePlatform()) {
      SplashScreen.hide();
    }
  }

  @action
  loading(transition: Transition): boolean {
    this.loader.setApplicationLoader(transition);
    return true;
  }

  private async trackPage(): Promise<void> {
    const page: string = this.router.currentURL;
    const title: string = this.router.currentRouteName || 'unknown';
    this.metrics.trackPage({ page, title });
  }

  /**
   * For every click or touchevent, generate a query selector
   * from the triggering DOM element and create an analytics event.
   * <div id="a" class="b c"></div> => `div.b.c#a`
   */
  private async trackClick(event: TouchEvent): Promise<void> {
    const target: HTMLElement = event.target as HTMLElement;
    const selector: string = htmlTreeAsString(target);
    this.metrics.trackEvent({
      event: 'click',
      properties: { selector },
    });
  }
}

export default instrumentRoutePerformance(ApplicationRoute);
