import Service from '@ember/service';
import { datadogRum } from '@datadog/browser-rum';
import { tracked } from '@glimmer/tracking';

export default class TelemetryService extends Service {
  @tracked isRecording = false;

  startRecording(): void {
    this.isRecording = true;
    return datadogRum.startSessionReplayRecording();
  }

  stopRecording(): void {
    this.isRecording = false;
    return datadogRum.stopSessionReplayRecording();
  }
}
