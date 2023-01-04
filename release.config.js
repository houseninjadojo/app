module.exports = {
  dryRun: false,
  debug: true,
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'semantic-release', prerelease: true },
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
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'CHANGELOG.md',
          'android/app/build.gradle',
          'package.json',
          'yarn.lock',
        ]
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'android/app/build.gradle',
          'package.json',
        ],
      },
    ],
  ],
};
