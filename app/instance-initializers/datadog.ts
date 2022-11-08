import { datadogLogs, type LogsInitConfiguration } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import ENV from 'houseninja/config/environment';

const options: LogsInitConfiguration = {
  ...ENV.datadog,
  env: ENV.environment,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: 'all',
  forwardReports: 'all',
  sampleRate: 100,
};

const rumOptions = {
  ...ENV.datadog,
  env: ENV.environment,
  sampleRate: 100,
  sessionReplaySampleRate: 100, // if not included, the default is 100
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  trackInteractions: true,
  telemetrySampleRate: 0,
  allowedTracingOrigins: [
    'https://api.houseninja.co',
    /https:\/\/.*\.houseninja\.co/,
  ],
};

export function initializeLogs() {
  if (['test', 'development'].includes(ENV.environment)) return;
  if (!ENV.datadog.clientToken) return;
  datadogLogs.init(options);
  datadogLogs.setLoggerGlobalContext({ env: ENV.environment });
  datadogLogs.setGlobalContextProperty('env', ENV.environment);
  datadogLogs.logger.setHandler(['console', 'http']);
  datadogLogs.logger.info('Datadog initialized');
}

export function initializeRum() {
  if (['test', 'development'].includes(ENV.environment)) return;
  if (!ENV.datadog.clientToken || !ENV.datadog.applicationId) return;
  datadogRum.init(rumOptions);
  datadogRum.startSessionReplayRecording();
}

export function initialize() {
  initializeLogs();
  initializeRum();
}

export default {
  name: 'datadog',
  initialize,
};
