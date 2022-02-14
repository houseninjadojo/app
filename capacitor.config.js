// eslint-disable-next-line
require('dotenv').config();

const base = {
  appId: 'co.houseninja.application',
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
  iosScheme: 'co.houseninja.application',
  androidScheme: 'co.houseninja.application',
  cleartext: false,
  url: 'http://localhost:4200',
  allowNavigation: [
    'auth.houseninja.co',
    'sandbox.auth.houseninja.co',
    'houseninja.co',
    '*.houseninja.co',
  ],
};

const plugins = {
  SplashScreen: {
    launchShowDuration: 0,
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
    androidApiKey: process.env.INTERCOM_API_KEY_ANDROID,
    androidAppId: process.env.INTERCOM_APP_ID,
    iosApiKey: process.env.INTERCOM_API_KEY_IOS,
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
  config.server.url = 'co.houseninja.application://';
}

if (environment === 'sandbox') {
  config.loggingBehavior = 'production';
  config.server.url = 'co.houseninja.application://';
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
