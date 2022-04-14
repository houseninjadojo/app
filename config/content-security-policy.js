// @see https://github.com/rwjblue/ember-cli-content-security-policy
// eslint-disable-next-line
module.exports = function (environment) {
  return {
    enabled: false,
    delivery: ['meta'],
    policy: {
      // Deny everything by default
      'default-src': ["'none'"],
      // Allow scripts at https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js
      'script-src': [
        "'self'",
        // "'unsafe-inline'",
        // "'unsafe-eval'",
        // 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
      ],
      'script-src-elem': [
        "'self'",
        "'sha256-iTXlDOuB0DC/QazcojKCUjRaxlVr5Ti8S+8lqi4GMcA='",
        "'sha256-T5tTHiUM+Z+5fLM8PaWbFdHRq75mOO60V0kpYsfAORs='",
        "'sha256-Ka2Bj962KtQU78/03MNuKejsZ1wIxQXQZjxfE/3HT0c='",
        'https://cdn.branch.io',
        'https://app.link',
        'https://api2.branch.io',
      ],
      // Allow fonts to be loaded from http://fonts.gstatic.com
      'font-src': ["'self'", 'http://fonts.gstatic.com'],
      // Allow data (xhr/websocket) from api-js.mixpanel.com and custom-api.local
      'connect-src': [
        "'self'",
        'https://api2.branch.io',
        // 'https://api-js.mixpanel.com',
        // 'https://custom-api.local',
      ],
      // Allow images from the origin itself (i.e. current domain)
      'img-src': ["'self'"],
      // Allow CSS loaded from https://fonts.googleapis.com
      'style-src': ["'self'", 'https://api2.branch.io'],
      // Omit `media-src` from policy
      // Browser will fallback to default-src for media resources (which is 'none', see above)
      'media-src': null,
      // Workers
      'worker-src': ["'self'", 'blob:'],
    },
    reportOnly: true,
  };
};
