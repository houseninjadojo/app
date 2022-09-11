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
    ENV['sentry-cli'] = {
      appName: 'app',
      orgName: 'houseninja',
      releaseName: `co.houseninja.application@${pkg.version}+1`,
      dist: `${commitSHA()}`,
      urlPrefix: '~/',
      assetsDir: 'dist/assets',
      authToken:
        'ff65161f14594302ab7597df9d8b92122cfd8029129b41b38ac13c3a05e54698',
    };
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['sentry-cli'] = {
      appName: 'app',
      orgName: 'houseninja',
      releaseName: `co.houseninja.application@${pkg.version}+1`,
      dist: `${commitSHA()}`,
      urlPrefix: '~/',
      assetsDir: 'dist/assets',
      authToken:
        'ff65161f14594302ab7597df9d8b92122cfd8029129b41b38ac13c3a05e54698',
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
