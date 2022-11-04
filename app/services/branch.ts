import Service, { service } from '@ember/service';
import Branch from 'houseninja/lib/branch';
import { tracked } from 'tracked-built-ins';
import { bind } from '@ember/runloop';
import ENV from 'houseninja/config/environment';

import type { InitOptions } from 'branch-sdk';
import type EventBusService from 'houseninja/services/event-bus';
import { captureException } from 'houseninja/utils/sentry';

export default class BranchService extends Service {
  @service declare eventBus: EventBusService;

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
    await Branch.init(ENV.branch.key, options);
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

  private handleInit(data: any): void {
    console.log('a');
    this.sessionData = data;
  }

  private handleInitError(error: any): void {
    console.log('asdfsad');
    captureException(error);
  }
}
