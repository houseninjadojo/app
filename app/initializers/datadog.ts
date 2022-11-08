import { datadogLogs, type LogsInitConfiguration } from '@datadog/browser-logs';
import Application from '@ember/application';
import ENV from 'houseninja/config/environment';

const options: LogsInitConfiguration = {
  ...ENV.datadog,
  env: ENV.environment,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: 'all',
  forwardReports: 'all',
  sampleRate: 100,
};

export function initialize(app: Application) {
  datadogLogs.init(options);
  app.register('logger:main', datadogLogs.logger, { instantiate: false });
  app.inject('route', 'logger', 'logger:main');
}

export default {
  name: 'logger',
  initialize,
};
