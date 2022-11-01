import Service from '@ember/service';

declare module 'ember-metrics/services/metrics' {
  export interface AdapterOption {
    name: string;
    environments: string[];
    config: any;
  }

  export default class MetricsService extends Service {
    context: any;
    enabled: boolean;
    appEnvironment: string;

    activateAdapters(adapterOptions: AdapterOption[]): void;

    identify(options: { distinctId: string; profile: object }): void;
    trackEvent(options: { event: string; properties?: object }): void;
    trackPage(options: { page: string; title: string }): void;
    alias(options: { alias: string; distinctId: string }): void;
    setProfile(options: { properties: object }): void;

    invoke(methodName: string, options: any): void;
    invoke(methodName: string): void;

    willDestroy(): void;
  }
}
