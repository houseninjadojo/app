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
        'changelogFile': 'CHANGELOG.md',
      },
    ],
    // [
    //   '@semantic-release/git',
    //   {
    //     'assets': ['CHANGELOG.md'],
    //   },
    // ],
    // '@semantic-release/npm',
  ],
};
