module.exports = {
  dryRun: false,
  debug: true,
  // branches: [
  //   'main',
  //   { name: 'semantic-release', prerelease: true },
  //   { name: 'testflight', prerelease: true },
  // ],
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'semantic-release', prerelease: true },
    // 'next',
    // 'next-major',
    { name: 'beta', prerelease: true },
    // { name: 'alpha', prerelease: true }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // [
    //   '@semantic-release/github',
    //   {
    //     publish: false,
    //     assets: [
    //       'CHANGELOG.md',
    //       'package.json',
    //       'yarn.lock',
    //       { path: 'dist', name: 'Ember Application' },
    //     ]
    //   },
    // ],
    // [
    //   '@semantic-release/npm',
    //   {
    //     npmPublish: false,
    //   }
    // ],
    // '@semantic-release/git',
  ],
};
