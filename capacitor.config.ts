import dotenvVaultCore from 'dotenv-vault-core';
import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';
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

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID,
  appName: 'House Ninja',
  bundledWebRuntime: false,
  loggingBehavior,
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    buildOptions: {
      releaseType: 'APK',
    },
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
  },
  server: {
    hostname: process.env.CAPACITOR_SERVER_HOSTNAME,
    iosScheme: process.env.APP_SCHEME,
    androidScheme: 'http',
    cleartext: environment === 'development',
    url: serverUrl,
    allowNavigation: allowedNavigation(environment),
  },
  plugins: {
    CapacitorCookies: {
      enabled: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#000000',
    },
    Keyboard: {
      resize: KeyboardResize.Body,
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
      token: process.env.MIXPANEL_TOKEN ?? '',
    },
  },
  cordova: {},
};

if (environment === 'production') {
  //
}

if (environment === 'sandbox') {
  //
}

if (environment === 'test') {
  //
}

if (environment === 'development') {
  //
}

export default config;
