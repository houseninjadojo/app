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
    launchShowDuration: 3000,
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
    androidApiKey: 'android_sdk-a93cf5fe93b642764014a740fca5425649a231f8',
    androidAppId: 'rgqc8u39',
    iosApiKey: 'ios_sdk-952078c58482051e56f9534434101ca50e6f7de7',
    iosAppId: 'rgqc8u39',
  },
  Mixpanel: {
    iosToken: 'cd20057a467eef665b9e86f0b687a5e3',
    androidToken: 'cd20057a467eef665b9e86f0b687a5e3',
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
