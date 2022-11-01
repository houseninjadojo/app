module.exports = function (environment) {
  const enabled = environment === 'production' || environment === 'sandbox';

  return {
    delivery: ['meta'],
    enabled,
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
        '*.pages.cloudflare.dev',
        'https://static.cloudflareinsights.com/beacon.min.js',
        process.env.APP_HOST,
      ],
      'font-src': [
        "'self'",
        'data:',
        '*.pages.cloudflare.dev',
        process.env.APP_HOST,
      ],
      'connect-src': [
        "'self'",
        '*.pages.cloudflare.dev',
        '*.ingest.sentry.io',
        'https://api-js.mixpanel.com',
        'https://api2.branch.io',
        `https://${process.env.AUTH_DOMAIN}`,
        process.env.API_HOST,
      ],
      'img-src': ["'self'", 'data:', process.env.APP_HOST],
      'style-src': ["'self'", 'data:', process.env.APP_HOST],
      'media-src': ["'self'"],
    },
    reportOnly: true,
  };
};
