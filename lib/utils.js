const path = require('module');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const isCI = () => {
  return !!process.env.CI || !!process.env.CF_PAGES;
};

const envPath = (env) => {
  let envExt = `.${env}`;
  if (env === 'development') {
    envExt = '';
  }
  return path.join(path.dirname(__dirname), `.env${envExt}`);
};

const isProdLike = () => {
  const envs = ['production', 'sandbox'];
  const currentEnv =
    EmberApp.env() ||
    process.env.EMBER_ENV ||
    process.env.NODE_ENV ||
    'development';
  return envs.includes(currentEnv);
};

module.exports = {
  envPath,
  isCI,
  isProdLike,
};
