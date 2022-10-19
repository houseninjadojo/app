// import type ApplicationInstance from '@ember/application/instance';
// import type SessionService from 'ember-simple-auth/services/session';

// import Sentry from 'houseninja/utils/sentry';

export function initialize(/* appInstance: ApplicationInstance */): void {
  // Sentry.addBreadcrumb({
  //   category: 'session',
  //   message: 'session-setup initializer starting',
  //   level: 'info',
  // });
  // const session: SessionService = appInstance.lookup(
  //   'service:session'
  // ) as SessionService;
  // session.setup();
}

export default {
  initialize,
  name: 'session-setup',
  before: 'deep-links',
};
