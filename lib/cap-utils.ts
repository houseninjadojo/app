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

export const allowedNavigation = (environment) => {
  switch (environment) {
    case 'development':
      return ['localhost', 'localhost:4200', 'sandbox.auth.houseninja.co'];
    case 'sandbox':
      return ['localhost', 'sandbox.auth.houseninja.co'];
    case 'production':
      return ['localhost', 'auth.houseninja.co', 'houseninja.co'];
  }
};
