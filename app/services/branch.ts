import Service, { service } from '@ember/service';
import Branch from 'houseninja/lib/branch';
import type { InitOptions } from 'branch-sdk';

import type EventBusService from 'houseninja/services/event-bus';

export default class BranchService extends Service {
  @service declare eventBus: EventBusService;

  plugin = Branch;
  pluginName = 'Branch';
  events = ['init', 'initError'];

  setupListeners() {
    this.removeAllListeners();
    this.registerEvents();
  }

  teardownListeners() {
    this.removeAllListeners();
  }

  async initialize(branch_key?: string, options?: InitOptions): Promise<void> {
    await Branch.init(branch_key, options);
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
}
