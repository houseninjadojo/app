module.exports = {
  dryRun: true,
  debug: true,
  branches: [
    // 'main',
    'semantic-release',
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
    [
      '@semantic-release/github',
      {
        publish: false,
        assets: [
          'CHANGELOG.md',
          'package.json',
          'yarn.lock',
          { path: 'dist', name: 'Ember Application' },
        ]
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      }
    ],
    '@semantic-release/git',
  ],
};
