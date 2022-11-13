import Service from '@ember/service';

declare module 'ember-metrics/services/metrics' {
  export interface AdapterOption {
    name: string;
    environments: string[];
    config: any;
  }

  export interface IdentifyOptions {
    distinctId: string;
    email?: string;
    name?: string;
    hmac?: string;
  }

  export default class MetricsService extends Service {
    context: any;
    enabled: boolean;
    appEnvironment: string;

    activateAdapters(adapterOptions: AdapterOption[]): void;

    identify(options: IdentifyOptions): void;
    trackEvent(options: {
      event: string;
      properties?: object;
      breadcrumb?: object;
    }): void;
    trackPage(options: { page: string; title: string }): void;
    alias(options: { alias: string; distinctId: string }): void;
    setProfile(options: { properties: object }): void;

    invoke(methodName: string, options: any): void;
    invoke(methodName: string): void;

    willDestroy(): void;

    _adaptersForEnv(adapterOptions: AdapterOption[]): void;
  }
}
