import { datadogLogs, type LogsInitConfiguration } from '@datadog/browser-logs';
import ApplicationInstance from '@ember/application/instance';
import ENV from 'houseninja/config/environment';

const options: LogsInitConfiguration = {
  ...ENV.datadog,
  env: ENV.environment,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: 'all',
  forwardReports: 'all',
  sampleRate: 100,
};

export function initialize() {
  if (ENV.environment === 'test') return;
  datadogLogs.init(options);
  datadogLogs.setLoggerGlobalContext({ env: ENV.environment });
  datadogLogs.setGlobalContextProperty('env', ENV.environment);
  datadogLogs.logger.setHandler(['console', 'http']);
  datadogLogs.logger.info('Datadog initialized');
}

export default {
  name: 'datadog',
  initialize,
};
