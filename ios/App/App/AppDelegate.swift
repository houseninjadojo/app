import UIKit
import Capacitor
import Firebase
import Intercom
import Branch
import SwiftKeychainWrapper

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        // Clear keychain on first run in case of reinstallation
        if UserDefaults.standard.bool(forKey: "FirstRun") == false {
            var _ = clearKeychain()
            // Delete values from keychain here
            UserDefaults.standard.set(true, forKey: "FirstRun")
            UserDefaults.standard.synchronize()
        }

        if isSimulator() {
          Branch.setUseTestBranchKey(true)
          Branch.getInstance().enableLogging()
        }

        // required for nativelink feature
        // @see https://help.branch.io/developers-hub/docs/ios-advanced-features#options-for-implementation
        Branch.getInstance().checkPasteboardOnInstall() // enable pasteboard check
        Branch.getInstance().initSession(launchOptions: launchOptions)

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        Branch.getInstance().application(app, open: url, options: options)
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        Branch.getInstance().continue(userActivity)
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // Push Notifications
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Intercom.setDeviceToken(deviceToken)
        NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        //Add any custom push handling for your own app here
        if (Intercom.isIntercomPushNotification(userInfo)) {
            Intercom.handlePushNotification(userInfo)
        } else {
            Branch.getInstance().handlePushNotification(userInfo)
        }
        completionHandler(.noData)
    }

    private func isSimulatorOrTestFlight() -> Bool {
        guard let path = Bundle.main.appStoreReceiptURL?.path else {
            return false
        }
        return path.contains("CoreSimulator") || path.contains("sandboxReceipt")
    }

    private func isSimulator() -> Bool {
        guard let path = Bundle.main.appStoreReceiptURL?.path else {
            return false
        }
        return path.contains("CoreSimulator")
    }

    private func clearKeychain() -> Bool {
        let keychainwrapper: KeychainWrapper = KeychainWrapper.init(serviceName: "cap_sec")
        let keys = keychainwrapper.allKeys();
        // cleanup standard keychain wrapper keys
        for key in keys {
            let hasValueStandard = KeychainWrapper.standard.hasValue(forKey: key)
            if (hasValueStandard) {
                KeychainWrapper.standard.removeObject(forKey: key)
            }
        }
        return keychainwrapper.removeAllKeys()
    }
}
