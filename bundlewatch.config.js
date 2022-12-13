const bundlewatchConfig = {
  files: [
    {
      path: './dist/assets/chunk.animations.*.js',
      // maxSize: '105kb',
    },
    {
      path: './dist/assets/chunk.app.*.js',
      // maxSize: '4kb',
    },
    {
      path: './dist/assets/chunk.capacitor.*.js',
      // maxSize: '21.5kb',
    },
    {
      path: './dist/assets/chunk.development.*.js',
      // maxSize: '1.35mb',
    },
    {
      path: './dist/assets/chunk.sentry.*.js',
      // maxSize: '150kb',
    },
    {
      path: './dist/assets/chunk.telemetry.*.js',
      // maxSize: '195kb',
    },
    {
      path: './dist/assets/houseninja.js',
      // maxSize: '160kb',
    },
    {
      path: './dist/assets/vendor.js',
      // maxSize: '850kb',
    },
    {
      path: './dist/assets/chunk.vendors-*.js',
      // maxSize: '500kb',
    },
  ],
  bundlewatchServiceHost: 'https://service.bundlewatch.io', // Can be a custom service
  ci: {
    // githubAccessToken: ciEnv.githubAccessToken,
    // repoOwner: 'houseninjadojo',
    // repoName: 'app',
    // repoCurrentBranch: 'main',
    repoBranchBase: 'main', // Branch PR is being merged into
    // commitSha: ciEnv.commitSha,
    trackBranches: ['main'],
  },
  defaultCompression: 'gzip',
};

module.exports = bundlewatchConfig;
