declare module 'ember-metrics/metrics-adapters/base' {
  export interface IdentifyOptions {
    distinctId: string;
    email?: string;
    name?: string;
    hmac?: string;
  }

  export default class BaseAdapter {
    static supportsFastBoot: boolean;

    config: any;
    metrics: any;

    toStringExtension(): string;
    init(): void;
    identify(options: any): void;
    trackEvent(options: any): void;
    trackPage(options: any): void;
    alias(options: any): void;
    setProfile(options: any): void;
    uninstall(): void;
    willDestroy(): void;
    toString(): string;
  }
}
