const path = require('module');

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

module.exports = {
  envPath,
  isCI,
};
