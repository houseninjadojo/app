/* eslint-env node */

'use strict';

const path = require('path');

// Disable by setting DOTENV_ENABLED=false
const isEnabled = () => {
  const val = process.env.DOTENV_ENABLED || 'true';
  return val === 'true';
};

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
      'DATADOG_CLIENT_TOKEN',
      'INTERCOM_APP_ID',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_WEB',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_IOS',
      'INTERCOM_IDENTITY_VERIFICATION_SECRET_ANDROID',
      'MIXPANEL_TOKEN',
      'SENTRY_DSN',
    ],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), `.env`),
    enabled: isEnabled(),
  };
};
