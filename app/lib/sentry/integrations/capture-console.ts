import { CaptureConsole } from '@sentry/integrations';

/**
 * CaptureConsole integration
 * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#captureconsole
 */

const levels = ['error', 'warn'];

export default new CaptureConsole({
  levels,
});
