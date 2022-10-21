import Sentry from 'houseninja/lib/sentry';
import config from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { Span, Transaction } from '@sentry/types';

export default Sentry;

export function captureException(ex: Error): void {
  if (config.environment === 'development') {
    console.error(ex);
  }
  debug(ex.message);
  Sentry.captureException(ex);
}

export function currentTransaction(): Transaction | undefined {
  return Sentry.getCurrentHub()?.getScope()?.getTransaction();
}

export function startTransaction(name: string, options = {}): Transaction {
  const transaction = Sentry.startTransaction({ name, ...options });
  Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));
  return transaction;
}

export function startSpan(op: string, params = {}): Span | undefined {
  const transaction = currentTransaction();
  if (transaction) {
    return transaction.startChild({ op, ...params });
  }
}
