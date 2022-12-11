/*  */

declare module 'ember-metrics/metrics-adapters/base' {
  export interface IdentifyOptions {
    distinctId: string;
    email?: string;
    name?: string;
    hmac?: string;
  }

  export type Config = object;

  export default class BaseAdapter {
    static supportsFastBoot: boolean;

    config: unknown;
    metrics: unknown;

    constructor(config: Config);

    toStringExtension(): string;
    init(): void;
    identify(options: unknown): void;
    trackEvent(options: unknown): void;
    trackPage(options: unknown): void;
    alias(options: unknown): void;
    setProfile(options: unknown): void;
    uninstall(): void;
    willDestroy(): void;
    toString(): string;
  }
}
