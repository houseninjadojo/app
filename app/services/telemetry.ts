import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { tracked } from '@glimmer/tracking';
import ENV from 'houseninja/config/environment';
import Sentry, { init as initSentry } from 'houseninja/lib/sentry';
import { TrackedMap } from 'tracked-built-ins';

const isAllowedEnvironment: boolean = ['sandbox', 'production'].includes(ENV.environment); // eslint-disable-line prettier/prettier
const doNotRecord = !isAllowedEnvironment;
let startedAtBoot = false;

export const initializeTelemetry = (): void => {
  initSentry();
  if (!doNotRecord) {
    datadogRum.startSessionReplayRecording();
    startedAtBoot = true;
  }
};

export default class TelemetryService extends Service {
  @tracked isRecording = !!startedAtBoot;
  #context = new TrackedMap();
  logger = datadogLogs.logger;
  rum = datadogRum;

  captureException(error: Error | string, context?: object): void {
    this.rum.addError(error, context);
    this.logger.error(`[telemetry] error captured`, context);
    Sentry.captureException(error, context);
  }

  startRecording(): void {
    if (doNotRecord) return;
    this.isRecording = true;
    this.rum.startSessionReplayRecording();
  }

  stopRecording(): void {
    if (doNotRecord) return;
    this.isRecording = false;
    this.rum.stopSessionReplayRecording();
  }

  addContext(key: string, value: unknown): void {
    this.#context.set(key, value);
    this.rum.setGlobalContext(this.context);
    this.logger.setContext(this.context);
  }

  removeContext(key: string): void {
    this.#context.delete(key);
    this.rum.setGlobalContext(this.context);
    this.logger.setContext(this.context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get context(): Record<string, any> {
    return Object.assign(
      { env: ENV.environment },
      Object.fromEntries(this.#context)
    );
  }
}
