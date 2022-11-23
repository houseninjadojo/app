import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { instrumentRoutePerformance } from '@sentry/ember';
import { action } from '@ember/object';
import isNativePlatform from 'houseninja/utils/is-native-platform';
import { SplashScreen } from '@capacitor/splash-screen';

import type Transition from '@ember/routing/transition';
import type IntercomService from 'houseninja/services/intercom';
import type NotificationService from 'houseninja/services/notifications';
import type RouterService from '@ember/routing/router-service';
import type StorageService from 'houseninja/services/storage';
import type MetricsService from 'houseninja/services/metrics';
import type EventBusService from 'houseninja/services/event-bus';
import type BranchService from 'houseninja/services/branch';
import type CapacitorService from 'houseninja/services/capacitor';
import type CurrentService from 'houseninja/services/current';
import type SessionService from 'houseninja/services/session';
import type LoaderService from 'houseninja/services/loader';
import type TelemetryService from 'houseninja/services/telemetry';

class ApplicationRoute extends Route {
  @service declare branch: BranchService;
  @service declare capacitor: CapacitorService;
  @service declare current: CurrentService;
  @service declare eventBus: EventBusService;
  @service declare intercom: IntercomService;
  @service declare metrics: MetricsService;
  @service declare session: SessionService;
  @service declare router: RouterService;
  @service declare loader: LoaderService;
  @service declare storage: StorageService;
  @service declare notifications: NotificationService;
  @service declare telemetry: TelemetryService;

  async beforeModel(): Promise<void> {
    await this.eventBus.setup();
    await this.capacitor.setup();
    await this.metrics.setup();
    await this.storage.setup();
    await this.intercom.setup();
    await this.session.setup();
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
}

export default instrumentRoutePerformance(ApplicationRoute);
