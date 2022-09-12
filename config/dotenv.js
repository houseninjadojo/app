/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (/* env */) {
  return {
    clientAllowedKeys: [
      'API_ACTIVE_STORAGE_HOST',
      'API_HOST',
      'APP_HOST',
      'APP_SCHEME',
      'AUTH_CLIENT_ID',
      'AUTH_AUDIENCE',
      'AUTH_CONNECTION',
      'AUTH_DOMAIN',
      'BRANCH_KEY',
      'CF_PAGES_COMMIT_SHA',
      'INTERCOM_APP_ID',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_WEB',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_IOS',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_ANDROID',
      'MIXPANEL_TOKEN',
      'SENTRY_DSN',
    ],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
