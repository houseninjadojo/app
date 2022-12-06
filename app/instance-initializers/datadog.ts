import { datadogLogs, type LogsInitConfiguration } from '@datadog/browser-logs';
import {
  datadogRum,
  RumEvent,
  RumEventDomainContext,
  RumFetchResourceEventDomainContext,
} from '@datadog/browser-rum';
import ENV from 'houseninja/config/environment';

const beforeSend = (
  event: RumEvent,
  context: RumEventDomainContext
): boolean => {
  if (event.type === 'resource') {
    // drop resource events for other sdks
    const blacklist = ['cloudflareinsights', 'sentry', 'mixpanel', 'intercom'];
    for (const domain of blacklist) {
      if (event.resource.url.includes(domain)) {
        return false;
      }
    }
    // collect a RUM resource's response headers
    if (event.resource.type === 'fetch') {
      const ctx = context as RumFetchResourceEventDomainContext;
      event.context = {
        ...event.context,
        response_headers: ctx.response?.headers,
        request_headers: ctx.requestInit?.headers,
      };
    }
  } else if (event.type === 'error') {
    if (event.error?.message?.includes('Item with given key does not exist')) {
      return false;
    }
  }
  return true;
};

const options: LogsInitConfiguration = {
  ...ENV.datadog,
  env: ENV.environment,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: 'all',
  forwardReports: 'all',
  sampleRate: 100,
  trackSessionAcrossSubdomains: true,
  useCrossSiteSessionCookie: true,
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
  beforeSend,
  trackSessionAcrossSubdomains: true,
  useCrossSiteSessionCookie: true,
};

export function initializeLogs() {
  if (['test', 'development'].includes(ENV.environment)) return;
  if (!ENV.datadog.clientToken) return;
  datadogLogs.init(options);
  datadogLogs.setLoggerGlobalContext({ env: ENV.environment });
  datadogLogs.setGlobalContextProperty('env', ENV.environment);
  datadogLogs.logger.setHandler(['console', 'http']);
  datadogLogs.logger.info('datadog initialized');
}

export function initializeRum() {
  if (['test', 'development'].includes(ENV.environment)) return;
  if (!ENV.datadog.clientToken || !ENV.datadog.applicationId) return;
  datadogRum.init(rumOptions);
}

export function initialize() {
  initializeLogs();
  initializeRum();
}

export default {
  name: 'datadog',
  initialize,
};
