const base = {
  appId: 'co.houseninja.app',
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
  iosScheme: 'co.houseninja.app',
  androidScheme: 'co.houseninja.app',
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
  config.server.url = null;
}

if (environment === 'sandbox') {
  config.loggingBehavior = 'production';
  config.server.url = null;
}

if (environment === 'test') {
  config.server.url = null;
}

if (environment === 'development') {
  // nothing yet
}

// eslint-disable-next-line
module.exports = config;
