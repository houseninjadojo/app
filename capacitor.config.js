// eslint-disable-next-line
require('dotenv').config();

const base = {
  appId: process.env.CAPACITOR_APP_ID,
  appName: 'House Ninja',
  bundledWebRuntime: false,
  loggingBehavior: 'debug',
  npmClient: 'yarn',
  webDir: 'dist',
};

const android = {
  allowMixedContent: false,
};

const ios = {
  contentInset: 'never',
  scrollEnabled: 'false',
};

const server = {
  hostname: 'localhost',
  iosScheme: process.env.APP_SCHEME,
  androidScheme: process.env.APP_SCHEME,
  cleartext: false,
  url: process.env.CAPACITOR_SERVER_URL,
  allowNavigation: [
    // 'localhost:3000',
    'auth.houseninja.co',
    'sandbox.auth.houseninja.co',
    'houseninja.co',
    '*.houseninja.co',
  ],
};

const plugins = {
  SplashScreen: {
    launchShowDuration: 1,
    launchAutoHide: false,
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
    iosToken: process.env.MIXPANEL_TOKEN,
    androidToken: process.env.MIXPANEL_TOKEN,
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

// eslint-disable-next-line
const environment = process.env.NODE_ENV;

if (environment === 'production') {
  config.loggingBehavior = 'production';
}

if (environment === 'sandbox') {
  config.loggingBehavior = 'production';
}

if (environment === 'test') {
  config.server.url = null;
}

if (environment === 'development') {
  // nothing yet
}

if (environment === 'mobile') {
  config.server.url = 'co.houseninja.application://localhost:4200';
}

// eslint-disable-next-line
module.exports = config;
