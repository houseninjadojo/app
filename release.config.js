const types = [
  // {"type": "build", "hidden": true },
  {"type": "feat", "section": "Features"},
  {"type": "fix", "section": "Bug Fixes"},
  {"type": "chore", "section": "Chores", "hidden": false },
  {"type": "docs", "section": "Docs", "hidden": false },
  {"type": "style", "section": "Styles", "hidden": false },
  {"type": "refactor", "section": "Improvements", "hidden": false },
  {"type": "perf", "section": "Improvements", "hidden": false },
  {"type": "test", "section": "Improvements", "hidden": false }
];

module.exports = {
  dryRun: false,
  debug: true,
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'semantic-release', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'build', release: 'patch' },
        ],
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types,
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        preset: 'conventionalcommits',
        presetConfig: {
          types,
        }
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
          { path: 'android/app/build.gradle', label: "build.gradle" },
        ]
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'package.json',
          { path: 'android/app/build.gradle', label: "build.gradle" },
        ],
        message: 'release: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      },
    ],
  ],
};
