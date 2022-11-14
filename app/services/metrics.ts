import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { htmlTreeAsString } from '@sentry/utils';
import { default as BaseMetricsService } from 'ember-metrics/services/metrics';
import UserActivityService from 'ember-user-activity/addon/services/user-activity';
import EventBusService from 'houseninja/services/event-bus';
import { ListenableEvented } from 'houseninja';

export default class MetricsService extends BaseMetricsService {
  @service declare eventBus: EventBusService;
  @service declare router: RouterService;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @service('ember-user-activity@user-activity')
  declare userActivity: UserActivityService;

  async reset(): Promise<void> {
    this.context = {};
    this.invoke('reset');
  }

  async setup(): Promise<void> {
    await this.setupListeners();
  }

  setupListeners(): void {
    this.eventBus.on('router.route-did-change', this, this.onRouteChanged);
    this.eventBus.on('user-activity.touchstart', this, this.onClick);
    this.eventBus.on('user-activity.mousedown', this, this.onClick);
  }

  teardownListeners(): void {
    this.removeAllListeners();
  }

  private onRouteChanged(): void {
    const page: string = this.router.currentURL;
    const title: string = this.router.currentRouteName || 'unknown';
    this.trackPage({ page, title });
  }

  /**
   * For every click or touchevent, generate a query selector
   * from the triggering DOM element and create an analytics event.
   * <div id="a" class="b c"></div> => `div.b.c#a`
   */
  private async onClick(event: TouchEvent): Promise<void> {
    const target: HTMLElement = event.target as HTMLElement;
    const selector: string = htmlTreeAsString(target);
    this.trackEvent({
      event: 'click',
      properties: { selector },
    });
  }

  async registerEvents(): Promise<void> {
    // await this.removeAllListeners();
    this.eventBus.subscribe(
      this.router as ListenableEvented,
      'Router',
      'routeDidChange'
    );
    this.eventBus.subscribe(this.userActivity, 'UserActivity', 'touchstart');
    this.eventBus.subscribe(this.userActivity, 'UserActivity', 'mousedown');
  }

  private async removeAllListeners(): Promise<void> {
    // await Intercom.removeAllListeners();
  }
}
