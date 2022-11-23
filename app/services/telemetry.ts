import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { tracked } from '@glimmer/tracking';
import ENV from 'houseninja/config/environment';
import { init as initSentry } from 'houseninja/lib/sentry';

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
