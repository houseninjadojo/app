import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { tracked } from '@glimmer/tracking';
import ENV from 'houseninja/config/environment';

const doNotRecord: boolean = ['sandbox', 'production'].includes(ENV.environment); // eslint-disable-line prettier/prettier

export default class TelemetryService extends Service {
  @tracked isRecording = false;

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
