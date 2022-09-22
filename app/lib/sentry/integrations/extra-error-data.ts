import { ExtraErrorData } from '@sentry/integrations';

/**
 * ExtraErrorData integration
 * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#extraerrordata
 */

const config = {
  // depth: 3,
};

export default new ExtraErrorData(config);
