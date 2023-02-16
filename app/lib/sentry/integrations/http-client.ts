import { HttpClient } from '@sentry/integrations';
import { HttpStatusCodeRange } from '@sentry/integrations/types/httpclient';

/**
 * Sentry HTTPClient integration
 * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#httpclient
 */

const config = {
  // This array can contain tuples of `[begin, end]` (both inclusive),
  // single status codes, or a combination of both.
  // default: [[500, 599]]
  failedRequestStatusCodes: [[500, 599]] as HttpStatusCodeRange[],

  // This array can contain Regexes, strings, or a combination of both.
  // default: [/.*/]
  failedRequestTargets: [/.*/],
};

export default new HttpClient(config);
