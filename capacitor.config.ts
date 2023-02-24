import dotenvVaultCore from 'dotenv-vault-core';
import { environment, serverUrl, loggingBehavior } from './lib/cap-utils';

dotenvVaultCore.config();
dotenvVaultCore.config();

const allowedNavigation = (environment) => {
  switch (environment) {
    case 'development':
      return ['localhost', 'localhost:4200', 'sandbox.auth.houseninja.co'];
    case 'sandbox':
      return ['localhost', 'sandbox.auth.houseninja.co'];
    case 'production':
      return ['localhost', 'auth.houseninja.co', 'houseninja.co'];
  }
};

/**
 * Capactior Configuration
 * https://capacitorjs.com/docs/config
 */

const base = {
  appId: process.env.CAPACITOR_APP_ID,
  appName: 'House Ninja',
  bundledWebRuntime: false,
  loggingBehavior,
  npmClient: 'pnpm',
  webDir: 'dist',
};

const android = {
  allowMixedContent: false,
  buildOptions: {
    releaseType: 'APK',
  },
};

const ios = {
  contentInset: 'never',
  scrollEnabled: 'false',
};

const server = {
  hostname: process.env.CAPACITOR_SERVER_HOSTNAME,
  iosScheme: process.env.APP_SCHEME,
  androidScheme: 'http',
  cleartext: environment === 'development',
  url: serverUrl,
  allowNavigation: allowedNavigation(environment),
};

const plugins = {
  CapacitorCookies: {
    enabled: false,
  },
  SplashScreen: {
    launchShowDuration: 0,
    launchAutoHide: true,
    backgroundColor: '#000000',
  },
  Keyboard: {
    resize: 'body',
  },
  PushNotifications: {
    presentationOptions: ['badge', 'sound', 'alert'],
  },
  LocalNotifications: {
    smallIcon: '',
    iconColor: '',
    sound: '',
  },
  Intercom: {
    androidApiKey: process.env.INTERCOM_ANDROID_API_KEY,
    androidAppId: process.env.INTERCOM_APP_ID,
    iosApiKey: process.env.INTERCOM_IOS_API_KEY,
    iosAppId: process.env.INTERCOM_APP_ID,
  },
  Mixpanel: {
    token: process.env.MIXPANEL_TOKEN,
  },
};

const cordova = {};

const config = {
  ...base,
  android,
  ios,
  server,
  plugins,
  cordova,
};

if (environment === 'production') {
  //
}

if (environment === 'sandbox') {
  //
}

if (environment === 'test') {
  // config.server.url = undefined;
}

if (environment === 'development') {
  // nothing yet
}

export default config;
