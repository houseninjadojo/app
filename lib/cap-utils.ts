import dotenvVaultCore from 'dotenv-vault-core';
dotenvVaultCore.config();

export const environment = (() => {
  return process.env.ENV || process.env.NODE_ENV || 'development';
})();

export const serverUrl = (() => {
  return environment === 'development'
    ? process.env.CAPACITOR_SERVER_URL
    : undefined;
})();

export const loggingBehavior = (() => {
  return environment === 'development' ? 'debug' : 'production';
})();
