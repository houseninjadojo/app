module.exports = {
  dryRun: true,
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
          'package.json',
          { path: 'android/app/build.gradle', label: "build.grade" },
        ]
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'package.json',
          { path: 'android/app/build.gradle', label: "build.grade" },
        ],
      },
    ],
  ],
};
