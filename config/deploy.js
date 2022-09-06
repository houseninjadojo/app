/* eslint-env node */
'use strict';

const pkg = require('../package.json');

const commitSHA = () => {
  if (process.env.CF_PAGES) {
    return process.env.CF_PAGES_COMMIT_SHA.substring(0, 8);
  } else {
    return '1';
  }
};

module.exports = function (deployTarget) {
  let ENV = {
    build: {
      outputPath: 'dist',
    },
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'sandbox') {
    ENV.build.environment = 'sandbox';
    // ENV.pipeline = {
    //   disabled: {
    //     sentry: true,
    //   },
    // };
    ENV.sentry = {
      // the URL or CDN your js assets are served from
      publicUrl: '~/',
      // the sentry install you're using, https://sentry.io for hosted accounts
      sentryUrl: 'https://sentry.io',
      sentryOrganizationSlug: 'houseninja',
      sentryProjectSlug: 'app',
      revisionKey: `co.houseninja.application@${pkg.version}+${commitSHA()}`,
      enableRevisionTagging: false,
      sentryBearerApiKey: 'ff65161f14594302ab7597df9d8b92122cfd8029129b41b38ac13c3a05e54698', // eslint-disable-line

      distDir: 'dist/assets',
    };
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.sentry = {
      // the URL or CDN your js assets are served from
      publicUrl: '~/',
      // the sentry install you're using, https://sentry.io for hosted accounts
      sentryUrl: 'https://sentry.io',
      sentryOrganizationSlug: 'houseninja',
      sentryProjectSlug: 'app',
      revisionKey: `co.houseninja.application@${pkg.version}+${commitSHA()}`,
      enableRevisionTagging: false,
      sentryBearerApiKey: 'ff65161f14594302ab7597df9d8b92122cfd8029129b41b38ac13c3a05e54698', // eslint-disable-line

      distDir: 'dist/assets',
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
