import Sentry from 'houseninja/lib/sentry';
import config from 'houseninja/config/environment';
import { debug } from '@ember/debug';

export default Sentry;

export function captureException(ex: Error): void {
  if (config.environment === 'development') {
    console.error(ex);
  }
  debug(ex.message);
  Sentry.captureException(ex);
}
