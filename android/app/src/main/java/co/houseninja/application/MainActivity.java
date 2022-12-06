package co.houseninja.application;

import android.content.Intent;
import android.os.Bundle;
import co.boundstate.BranchDeepLinks;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import io.sentry.capacitor.SentryCapacitor;
import java.util.ArrayList;
import io.branch.referral.Branch;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // Branch.getInstance().setRequestMetadataKey("insert_user_id", "value"); // if you need to append partner metadata before initializing Branch
    registerPlugin(BranchDeepLinks.class);
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onNewIntent(Intent intent) {
    this.setIntent(intent);
    super.onNewIntent(intent);
  }
}
