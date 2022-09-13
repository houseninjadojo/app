// Code Coverage Configuration
// @see https://github.com/kategengler/ember-cli-code-coverage#configuration
module.exports = {
  coverageEnvVar: 'COVERAGE',
  reporters: ['lcov', 'html'],
  excludes: ['*/mirage/**/*'],
  coverageFolder: 'coverage',
  parallel: false,
};
