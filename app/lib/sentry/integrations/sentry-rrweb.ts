import SentryRRWeb from '@sentry/rrweb';

/**
 * Sentry RRWeb integration
 * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/rrweb/
 */

// @see https://github.com/rrweb-io/rrweb/blob/master/guide.md#options
const config = {
  // maskInputOptions: {
  //   password: true,
  //   email: true,
  //   tel: true,
  //   // creditCard: true,
  // }
};

export default new SentryRRWeb(config);
