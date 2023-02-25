import dotenvVaultCore from 'dotenv-vault-core';
import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import {
  environment,
  serverUrl,
  loggingBehavior,
  allowedNavigation,
} from './lib/cap-utils';

dotenvVaultCore.config();
dotenvVaultCore.config();

/**
 * Capactior Configuration
 * https://capacitorjs.com/docs/config
 */

const config: CapacitorConfig = {
  /**
   * The unique identifier of your packaged app.
   *
   * This is also known as the Bundle ID in iOS and the Application ID in
   * Android. It must be in reverse domain name notation, generally
   * representing a domain name that you or your company owns.
   *
   * @since 1.0.0
   */
  appId: process.env.CAPACITOR_APP_ID,

  /**
   * The human-friendly name of your app.
   *
   * This should be what you'd see in the App Store, but can be changed after
   * within each native platform after it is generated.
   *
   * @since 1.0.0
   */
  appName: 'House Ninja',

  /**
   * The directory of your compiled web assets.
   *
   * This directory should contain the final `index.html` of your app.
   *
   * @since 1.0.0
   */
  webDir: 'dist',

  /**
   * Whether to copy the Capacitor runtime bundle or not.
   *
   * If your app is not using a bundler, set this to `true`, then Capacitor
   * will create a `capacitor.js` file that you'll need to add as a script in
   * your `index.html` file.
   *
   * @since 1.0.0
   * @default false
   */
  bundledWebRuntime: false,

  /**
   * The build configuration (as defined by the native app) under which Capacitor
   * will send statements to the log system. This applies to log statements in
   * native code as well as statements redirected from JavaScript (`console.debug`,
   * `console.error`, etc.). Enabling logging will let statements render in the
   * Xcode and Android Studio windows but can leak information on device if enabled
   * in released builds.
   *
   * 'none' = logs are never produced
   * 'debug' = logs are produced in debug builds but not production builds
   * 'production' = logs are always produced
   *
   * @since 3.0.0
   * @default debug
   */
  loggingBehavior,

  /**
   * User agent of Capacitor Web View.
   *
   * @since 1.4.0
   */
  // overrideUserAgent: '',

  /**
   * String to append to the original user agent of Capacitor Web View.
   *
   * This is disregarded if `overrideUserAgent` is used.
   *
   * @since 1.4.0
   */
  // appendUserAgent: '',

  /**
   * Background color of the Capacitor Web View.
   *
   * @since 1.1.0
   */
  // backgroundColor: '',

  android: {
    /**
     * Specify a custom path to the native Android project.
     *
     * @since 3.0.0
     * @default android
     */
    path: 'android',

    /**
     * User agent of Capacitor Web View on Android.
     *
     * Overrides global `overrideUserAgent` option.
     *
     * @since 1.4.0
     */
    // overrideUserAgent: '',

    /**
     * String to append to the original user agent of Capacitor Web View for Android.
     *
     * Overrides global `appendUserAgent` option.
     *
     * This is disregarded if `overrideUserAgent` is used.
     *
     * @since 1.4.0
     */
    // appendUserAgent: '',

    /**
     * Background color of the Capacitor Web View for Android.
     *
     * Overrides global `backgroundColor` option.
     *
     * @since 1.1.0
     */
    // backgroundColor: '',

    /**
     * Enable mixed content in the Capacitor Web View for Android.
     *
     * [Mixed
     * content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
     * is disabled by default for security. During development, you may need to
     * enable it to allow the Web View to load files from different schemes.
     *
     * **This is not intended for use in production.**
     *
     * @since 1.0.0
     * @default false
     */
    allowMixedContent: false,

    /**
     * This enables a simpler keyboard which may have some limitations.
     *
     * This will capture JS keys using an alternative
     * [`InputConnection`](https://developer.android.com/reference/android/view/inputmethod/InputConnection).
     *
     * @since 1.0.0
     * @default false
     */
    captureInput: false,

    /**
     * Always enable debuggable web content.
     *
     * This is automatically enabled during development.
     *
     * @since 1.0.0
     * @default false
     */
    webContentsDebuggingEnabled: false,

    /**
     * The build configuration under which Capacitor will generate logs on Android.
     *
     * Overrides global `loggingBehavior` option.
     *
     * @since 3.0.0
     * @default debug
     */
    loggingBehavior: loggingBehavior,

    /**
     * Allowlist of plugins to include during `npx cap sync` for Android.
     *
     * Overrides global `includePlugins` option.
     *
     * @since 3.0.0
     */
    // includePlugins: [],

    /**
     * Android flavor to use.
     *
     * If the app has flavors declared in the `build.gradle`
     * configure the flavor you want to run with `npx cap run` command.
     *
     * @since 3.1.0
     */
    // flavor: '',

    /**
     * Whether to give the webview initial focus.
     *
     * @since 3.5.1
     * @default true
     */
    initialFocus: true,

    /**
     * The minimum supported webview version on Android supported by your app.
     *
     * The minimum supported cannot be lower than version `55`, which is required for Capacitor.
     *
     * If the device uses a lower WebView version, an error message will be shown on Logcat.
     * If `server.errorPath` is configured, the WebView will redirect to that file, so can be
     * used to show a custom error.
     *
     * @since 4.0.0
     * @default 60
     */
    minWebViewVersion: 60,

    buildOptions: {
      /**
       * Path to your keystore
       *
       * @since 4.4.0
       */
      keystorePath: `android/${process.env.ANDROID_KEYSTORE_NAME}`,

      /**
       * Password to your keystore
       *
       * @since 4.4.0
       */
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,

      /**
       * Alias in the keystore to use
       *
       * @since 4.4.0
       */
      keystoreAlias: process.env.ANDROID_KEY_NAME,

      /**
       * Password for the alias in the keystore to use
       *
       * @since 4.4.0
       */
      keystoreAliasPassword: process.env.ANDROID_KEY_PASSWORD,

      /**
       * Bundle type for your release build
       *
       * @since 4.4.0
       * @default "AAB"
       */
      releaseType: 'APK',
    },

    /**
     * Use legacy [addJavascriptInterface](https://developer.android.com/reference/android/webkit/WebView#addJavascriptInterface(java.lang.Object,%20java.lang.String))
     * instead of the new and more secure [addWebMessageListener](https://developer.android.com/reference/androidx/webkit/WebViewCompat#addWebMessageListener(android.webkit.WebView,java.lang.String,java.util.Set%3Cjava.lang.String%3E,androidx.webkit.WebViewCompat.WebMessageListener))
     *
     * @since 4.5.0
     * @default false
     */
    useLegacyBridge: false,
  },

  ios: {
    /**
     * Specify a custom path to the native iOS project.
     *
     * @since 3.0.0
     * @default ios
     */
    path: 'ios',

    /**
     * iOS build scheme to use.
     *
     * Usually this matches your app's target in Xcode. You can use the
     * following command to list schemes:
     *
     * ```shell
     * xcodebuild -workspace ios/App/App.xcworkspace -list
     * ```
     *
     * @since 3.0.0
     * @default App
     */
    scheme: 'App',

    /**
     * User agent of Capacitor Web View on iOS.
     *
     * Overrides global `overrideUserAgent` option.
     *
     * @since 1.4.0
     */
    // overrideUserAgent: '',

    /**
     * String to append to the original user agent of Capacitor Web View for iOS.
     *
     * Overrides global `appendUserAgent` option.
     *
     * This is disregarded if `overrideUserAgent` is used.
     *
     * @since 1.4.0
     */
    // appendUserAgent: '',

    /**
     * Background color of the Capacitor Web View for iOS.
     *
     * Overrides global `backgroundColor` option.
     *
     * @since 1.1.0
     */
    // backgroundColor: '',

    /**
     * Configure the scroll view's content inset adjustment behavior.
     *
     * This will set the
     * [`contentInsetAdjustmentBehavior`](https://developer.apple.com/documentation/uikit/uiscrollview/2902261-contentinsetadjustmentbehavior)
     * property on the Web View's
     * [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview).
     *
     * @since 2.0.0
     * @default never
     */
    contentInset: 'never',

    /**
     * Configure whether the scroll view is scrollable.
     *
     * This will set the
     * [`isScrollEnabled`](https://developer.apple.com/documentation/uikit/uiscrollview/1619395-isscrollenabled)
     * property on the Web View's
     * [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview).
     *
     * @since 1.0.0
     */
    scrollEnabled: false,

    /**
     * Configure custom linker flags for compiling Cordova plugins.
     *
     * @since 1.0.0
     * @default []
     */
    cordovaLinkerFlags: [],

    /**
     * Allow destination previews when pressing on links.
     *
     * This will set the
     * [`allowsLinkPreview`](https://developer.apple.com/documentation/webkit/wkwebview/1415000-allowslinkpreview)
     * property on the Web View, instead of using the default value.
     *
     * @since 2.0.0
     */
    // allowsLinkPreview: false,

    /**
     * The build configuration under which Capacitor will generate logs on iOS.
     *
     * Overrides global `loggingBehavior` option.
     *
     * @since 3.0.0
     * @default debug
     */
    loggingBehavior: loggingBehavior,

    /**
     * Allowlist of plugins to include during `npx cap sync` for iOS.
     *
     * Overrides global `includePlugins` option.
     *
     * @since 3.0.0
     */
    includePlugins: [],

    /**
     * Sets WKWebView configuration for limitsNavigationsToAppBoundDomains.
     *
     * If the Info.plist file includes `WKAppBoundDomains` key, it's recommended to
     * set this option to true, otherwise some features won't work.
     * But as side effect, it blocks navigation outside the domains in the
     * `WKAppBoundDomains` list.
     * `localhost` (or the value configured as `server.hostname`) also needs to be
     * added to the `WKAppBoundDomains` list.
     *
     * @since 3.1.0
     * @default false
     */
    limitsNavigationsToAppBoundDomains: false,

    /**
     * The content mode for the web view to use when it loads and renders web content.
     *
     * - 'recommended': The content mode that is appropriate for the current device.
     * - 'desktop': The content mode that represents a desktop experience.
     * - 'mobile': The content mode that represents a mobile experience.
     *
     * @since 4.0.0
     * @default recommended
     */
    preferredContentMode: 'recommended',

    /**
     * Configure if Capacitor will handle local/push notifications.
     * Set to false if you want to use your own UNUserNotificationCenter to handle notifications.
     *
     * @since 4.5.0
     * @default true
     */
    handleApplicationNotifications: true,
  },

  server: {
    /**
     * Configure the local hostname of the device.
     *
     * It is recommended to keep this as `localhost` as it allows the use of
     * Web APIs that would otherwise require a [secure
     * context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
     * such as
     * [`navigator.geolocation`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation)
     * and
     * [`MediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).
     *
     * @since 1.0.0
     * @default localhost
     */
    hostname: process.env.CAPACITOR_SERVER_HOSTNAME,

    /**
     * Configure the local scheme on iOS.
     *
     * [Can't be set to schemes that the WKWebView already handles, such as http or https](https://developer.apple.com/documentation/webkit/wkwebviewconfiguration/2875766-seturlschemehandler)
     * This can be useful when migrating from
     * [`cordova-plugin-ionic-webview`](https://github.com/ionic-team/cordova-plugin-ionic-webview),
     * where the default scheme on iOS is `ionic`.
     *
     * @since 1.2.0
     * @default capacitor
     */
    iosScheme: process.env.APP_SCHEME,

    /**
     * Configure the local scheme on Android.
     *
     * @since 1.2.0
     * @default http
     */
    androidScheme: 'http',

    /**
     * Load an external URL in the Web View.
     *
     * This is intended for use with live-reload servers.
     *
     * **This is not intended for use in production.**
     *
     * @since 1.0.0
     */
    url: serverUrl,

    /**
     * Allow cleartext traffic in the Web View.
     *
     * On Android, all cleartext traffic is disabled by default as of API 28.
     *
     * This is intended for use with live-reload servers where unencrypted HTTP
     * traffic is often used.
     *
     * **This is not intended for use in production.**
     *
     * @since 1.5.0
     * @default false
     */
    cleartext: environment === 'development',

    /**
     * Set additional URLs the Web View can navigate to.
     *
     * By default, all external URLs are opened in the external browser (not
     * the Web View).
     *
     * **This is not intended for use in production.**
     *
     * @since 1.0.0
     * @default []
     */
    allowNavigation: allowedNavigation(environment),

    /**
     * Specify path to a local html page to display in case of errors.
     * On Android the html file won't have access to Capacitor plugins.
     *
     * @since 4.0.0
     * @default null
     */
    errorPath: undefined,
  },

  cordova: {
    /**
     * Populates <access> tags in the config.xml with the origin set to
     * the values entered here.
     * If not provided, a single <access origin="*" /> tag gets included.
     * It only has effect on a few Cordova plugins that respect the whitelist.
     *
     * @since 3.3.0
     */
    accessOrigins: [],

    /**
     * Configure Cordova preferences.
     *
     * @since 1.3.0
     */
    /* A static plugin that is being used to add a plugin to the static plugins array. */
    preferences: {},

    /**
     * List of Cordova plugins that need to be static but are not
     * already in the static plugin list.
     *
     * @since 3.3.0
     */
    staticPlugins: [],
  },

  /**
   * Configure plugins.
   *
   * This is an object with configuration values specified by plugin class
   * name.
   *
   * @since 1.0.0
   */
  plugins: {
    /**
     * Capacitor Cookies plugin configuration
     *
     * @since 4.3.0
     */
    CapacitorCookies: {
      /**
       * Enable CapacitorCookies to override the global `document.cookie` on native.
       *
       * @default false
       */
      enabled: false,
    },

    /**
     * Capacitor Http plugin configuration
     *
     * @since 4.3.0
     */
    CapacitorHttp: {
      /**
       * Enable CapacitorHttp to override the global `fetch` and `XMLHttpRequest` on native.
       *
       * @default false
       */
      enabled: false,
    },

    /**
     * @see https://github.com/houseninjadojo/capacitor-intercom
     */
    Intercom: {
      /**
       * Interom Android API Key
       *
       * @since 1.0.0
       */
      androidApiKey: process.env.INTERCOM_ANDROID_API_KEY,

      /**
       * Interom Android App ID
       *
       * @since 1.0.0
       */
      androidAppId: process.env.INTERCOM_APP_ID,

      /**
       * Interom iOS API Key
       *
       * @since 1.0.0
       */
      iosApiKey: process.env.INTERCOM_IOS_API_KEY,

      /**
       * Interom iOS App ID
       *
       * @since 1.0.0
       */
      iosAppId: process.env.INTERCOM_APP_ID,
    },

    /**
     * @see https://capacitorjs.com/docs/apis/keyboard
     */
    Keyboard: {
      /**
       * Configure the way the app is resized when the Keyboard appears.
       * Only available on iOS.
       *
       * @since 1.0.0
       * @default KeyboardResize.Native
       */
      resize: KeyboardResize.Body,

      /**
       * Override the keyboard style if your app doesn't support dark/light theme changes.
       * If not set, the keyboard style will depend on the device appearance.
       * Only available on iOS.
       *
       * @since 1.0.0
       * @default KeyboardStyle.Default
       */
      style: KeyboardStyle.Default,

      /**
       * There is an Android bug that prevents the keyboard from resizing the
       * WebView when the app is in full screen (i.e. if StatusBar plugin is used
       * to overlay the status bar). This setting, if set to true, add a
       * workaround that resizes the WebView even when the app is in full screen.
       * Only available for Android
       *
       * @since 1.1.0
       */
      resizeOnFullScreen: false,
    },

    /**
     * @see https://capacitorjs.com/docs/apis/local-notifications
     */
    LocalNotifications: {
      /**
       * Set the default status bar icon for notifications.
       *
       * Icons should be placed in your app's `res/drawable` folder.
       * The value for this option should be the drawable resource ID,
       * which is the filename without an extension.
       * Only available for Android.
       *
       * @since 1.0.0
       */
      smallIcon: '',

      /**
       * Set the default color of status bar icons for notifications.
       * Only available for Android.
       *
       * @since 1.0.0
       */
      iconColor: '',

      /**
       * Set the default notification sound for notifications.
       *
       * On Android 26+ it sets the default channel sound and can't be changed unless
       * the app is uninstalled. If the audio file is not found, it will result in
       * the default system sound being played on Android 21-25 and no sound on
       * Android 26+.
       * Only available for Android.
       *
       * @since 1.0.0
       */
      sound: '',
    },

    /**
     * @see https://github.com/houseninjadojo/capacitor-mixpanel
     */
    Mixpanel: {
      /**
       * Mixpanel Token
       *
       * @required
       * @example "asdf1234asdf1234"
       */
      token: process.env.MIXPANEL_TOKEN ?? '',

      /**
       * Optional. Whether or not to collect common mobile events. Default is true.
       *
       * @default true
       */
      trackAutomaticEvents: true,

      /**
       * Optional. Whether or not Mixpanel can start tracking immediately. Default is false.
       *
       * @required
       * @default false
       */
      optOutTrackingByDefault: false,

      /**
       * Optional. Disables ip collection on iOS devices. Default is false.
       * For Android, this is done via a meta-data property. See {@link https://help.mixpanel.com/hc/en-us/articles/115004494803}
       *
       * @required
       * @default false
       */
      disableIosIpCollection: false,

      /**
       * Optional. Mixpanel cluster URL or EU server URL. Defaults to US server.
       *
       * @default 'https://api.mixpanel.com'
       * @example 'https://api-eu.mixpanel.com/'
       */
      serverURL: 'https://api.mixpanel.com',
    },

    /**
     * @see https://capacitorjs.com/docs/apis/push-notifications
     */
    PushNotifications: {
      /**
       * This is an array of strings you can combine.
       *
       * Possible values in the array are:
       *   - badge: badge count on the app icon is updated (default value)
       *   - sound: the device will ring/vibrate when the push notification is received
       *   - alert: the push notification is displayed in a native dialog
       *
       * An empty array can be provided if none of the options are desired.
       *
       * badge is only available for iOS.
       *
       * @since 1.0.0
       */
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    /**
     * @see https://capacitorjs.com/docs/apis/splash-screen
     */
    SplashScreen: {
      /**
       * How long to show the launch splash screen when autoHide is enabled (in ms)
       *
       * @since 1.0.0
       * @default 500
       */
      launchShowDuration: 0,

      /**
       * Whether to auto hide the splash after launchShowDuration.
       *
       * @since 1.0.0
       * @default true
       */
      launchAutoHide: true,

      /**
       * Duration for the fade out animation of the launch splash screen (in ms)
       *
       * Only available for Android, when using the Android 12 Splash Screen API.
       *
       * @since 4.2.0
       * @default 200
       */
      launchFadeOutDuration: 200,

      /**
       * Color of the background of the Splash Screen in hex format, #RRGGBB or #RRGGBBAA.
       * Doesn't work if `useDialog` is true or on launch when using the Android 12 API.
       *
       * @since 1.0.0
       * @example '#ffffffff'
       */
      backgroundColor: '#000000',

      /**
       * Name of the resource to be used as Splash Screen.
       *
       * Doesn't work on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.0.0
       * @default splash
       */
      androidSplashResourceName: 'splash',

      /**
       * The [ImageView.ScaleType](https://developer.android.com/reference/android/widget/ImageView.ScaleType) used to scale
       * the Splash Screen image.
       * Doesn't work if `useDialog` is true or on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.0.0
       * @default FIT_XY
       */
      androidScaleType: 'FIT_XY',

      /**
       * Show a loading spinner on the Splash Screen.
       * Doesn't work if `useDialog` is true or on launch when using the Android 12 API.
       *
       * @since 1.0.0
       * @example true
       */
      showSpinner: false,

      /**
       * Style of the Android spinner.
       * Doesn't work if `useDialog` is true or on launch when using the Android 12 API.
       *
       * @since 1.0.0
       * @default large
       */
      androidSpinnerStyle: 'large',

      /**
       * Style of the iOS spinner.
       * Doesn't work if `useDialog` is true.
       *
       * Only available on iOS.
       *
       * @since 1.0.0
       * @default large
       */
      iosSpinnerStyle: 'large',

      /**
       * Color of the spinner in hex format, #RRGGBB or #RRGGBBAA.
       * Doesn't work if `useDialog` is true or on launch when using the Android 12 API.
       *
       * @since 1.0.0
       * @example '#999999'
       */
      // spinnerColor: '',

      /**
       * Hide the status bar on the Splash Screen.
       *
       * Doesn't work on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.0.0
       */
      splashFullScreen: false,

      /**
       * Hide the status bar and the software navigation buttons on the Splash Screen.
       *
       * Doesn't work on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.0.0
       */
      splashImmersive: false,

      /**
       * If `useDialog` is set to true, configure the Dialog layout.
       * If `useDialog` is not set or false, use a layout instead of the ImageView.
       *
       * Doesn't work on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.1.0
       * @example 'launch_screen'
       */
      // layoutName: '',

      /**
       * Use a Dialog instead of an ImageView.
       * If `layoutName` is not configured, it will use
       * a layout that uses the splash image as background.
       *
       * Doesn't work on launch when using the Android 12 API.
       *
       * Only available on Android.
       *
       * @since 1.1.0
       */
      useDialog: false,
    },
  },

  /**
   * Allowlist of plugins to include during `npx cap sync`.
   *
   * This should be an array of strings representing the npm package name of
   * plugins to include when running `npx cap sync`. If unset, Capacitor will
   * inspect `package.json` for a list of potential plugins.
   *
   * @since 3.0.0
   */
  // includePlugins: [],
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
