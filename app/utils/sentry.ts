import Sentry from 'houseninja/lib/sentry';
import config from 'houseninja/config/environment';
import { debug } from '@ember/debug';
import { SeverityLevel, Span, SpanContext, Transaction } from '@sentry/types';
import { getActiveTransaction } from '@sentry/ember';

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

// eslint-disable-next-line prettier/prettier
export function startSpan(params: SpanContext): Span | undefined {
  const transaction = getActiveTransaction();
  if (transaction) {
    return transaction.startChild(params);
  }
}

// export const addBreadcrumb = Sentry.addBreadcrumb;

export const addBreadcrumb = (
  category?: string,
  message?: string,
  data?: Record<string, unknown>,
  type: string | 'navigation' | 'http' | 'user' | 'ui' | 'error' = 'ui',
  level: SeverityLevel = 'info'
) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    type,
    level,
  });
};
