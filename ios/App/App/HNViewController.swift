//
//  HNViewController.swift
//  House Ninja
//
//  Created by Miles Zimmerman on 11/16/22.
//

import UIKit
import Capacitor
import Datadog
import Cordova

class HNViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        print("ASDASDASD")
        // Do any additional setup after loading the view.
    }
    
    override func capacitorDidLoad() {
        webView?.configuration.userContentController.trackDatadogEvents(in: ["localhost", "app.houseninja.co", "localhost:4200", "sandbox.auth.houseninja.co"])
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
