import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { tracked } from '@glimmer/tracking';
import ENV from 'houseninja/config/environment';

export default class TelemetryService extends Service {
  @tracked isRecording = false;

  startRecording(): void {
    if (this.doNotRecord) return;
    this.isRecording = true;
    return datadogRum.startSessionReplayRecording();
  }

  stopRecording(): void {
    if (this.doNotRecord) return;
    this.isRecording = false;
    return datadogRum.stopSessionReplayRecording();
  }

  get doNotRecord(): boolean {
    const isProduction: boolean = ['sandbox', 'production'].includes(ENV.environment); // eslint-disable-line prettier/prettier
    return !isProduction;
  }
}
