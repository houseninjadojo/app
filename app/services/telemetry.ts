import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { tracked } from '@glimmer/tracking';
import ENV from 'houseninja/config/environment';

const isAllowedEnvironment: boolean = ['sandbox', 'production'].includes(ENV.environment); // eslint-disable-line prettier/prettier
const doNotRecord = !isAllowedEnvironment;
let startedAtBoot = false;

export const initializeTelemetry = (): void => {
  if (!doNotRecord) {
    datadogRum.startSessionReplayRecording();
    startedAtBoot = true;
  }
};

export const captureException = (error: Error): void => {
  datadogRum.addError(error);
};

export default class TelemetryService extends Service {
  @tracked isRecording = !!startedAtBoot;

  startRecording(): void {
    if (doNotRecord) return;
    this.isRecording = true;
    datadogRum.startSessionReplayRecording();
  }

  stopRecording(): void {
    if (doNotRecord) return;
    this.isRecording = false;
    datadogRum.stopSessionReplayRecording();
  }
}
