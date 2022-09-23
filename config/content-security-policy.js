module.exports = function (environment) {
  const enabled = environment === 'production' || environment === 'sandbox';

  return {
    delivery: ['meta'],
    enabled: enabled,
    failTests: false,
    policy: {
      'default-src': ["'none'"],
      'script-src': [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        'https://cdn.branch.io',
        'https://app.link',
        'https://api2.branch.io',
      ],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'img-src': ["'self'"],
      'style-src': ["'self'"],
      'media-src': ["'self'"],
    },
    reportOnly: true,
  };
};
