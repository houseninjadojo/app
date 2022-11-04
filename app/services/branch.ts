import Service, { service } from '@ember/service';
import Branch from 'houseninja/lib/branch';
import { tracked } from 'tracked-built-ins';
import { bind } from '@ember/runloop';
import ENV from 'houseninja/config/environment';
import Sentry, { captureException } from 'houseninja/utils/sentry';

import type { InitOptions } from 'branch-sdk';
import type EventBusService from 'houseninja/services/event-bus';
import type MetricsService from 'houseninja/services/metrics';

export default class BranchService extends Service {
  @service declare eventBus: EventBusService;
  @service declare metrics: MetricsService;

  plugin = Branch;
  pluginName = 'Branch';
  events = ['init', 'initError'];

  private sessionData = tracked({});

  async setup() {
    this.setupListeners();
    this.initialize();
  }

  setupListeners() {
    this.eventBus.on('branch.init', bind(this, this.handleInit));
    this.eventBus.on('branch.init-error', bind(this, this.handleInitError));
  }

  teardownListeners() {
    this.removeAllListeners();
  }

  async initialize(options?: InitOptions): Promise<void> {
    await Branch.init(this.eventBus, ENV.branch.key, options);
  }

  async data(): Promise<object | undefined> {
    return this.sessionData;
  }

  async identify(identity: string): Promise<void> {
    await Branch.setIdentity({ newIdentity: identity });
  }

  async logout(): Promise<void> {
    await Branch.logout();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async track(eventName: string, metaData?: any): Promise<void> {
    await Branch.sendBranchEvent({ eventName, metaData });
  }

  async registerEvents(): Promise<void> {
    await this.removeAllListeners();
    await this.eventBus.registerEvents(
      this.plugin,
      this.pluginName,
      this.events
    );
  }

  private async removeAllListeners(): Promise<void> {
    await Branch.removeAllListeners();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleInit(data: any): void {
    this.metrics.trackEvent({
      event: 'Opened with branch Link',
      properties: data.data_parsed,
    });
    Sentry.addBreadcrumb({
      type: 'user',
      category: 'deep-link.open',
      message: 'Branch deeo link link',
      data,
    });
    this.sessionData = data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleInitError(error: any): void {
    captureException(error);
  }
}
