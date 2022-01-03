// import {
//   impact,
//   notification,
//   vibrate,
//   selectionStart,
//   selectionChanged,
//   selectionEnd,
// } from 'houseninja/utils/haptics';
import { module, skip } from 'qunit';
// import sinon from 'sinon';

import { Haptics } from '@capacitor/haptics';

// @todo I don't know how to spy on Proxy objects
// If that is figured out then maybe we can test it
module('Unit | Utility | native/haptics', function () {
  // hooks.beforeEach(function () {
  //   console.log(HapticsPlugin);
  //   sinon.stub(HapticsPlugin, 'impact').return(true);
  // });

  module('impact', function () {
    skip('default', async function (assert) {
      // sinon.stub(Haptics.web, 'impact')
      // console.log(Object.keys(Haptics));
      // await impact();
      assert.ok(Haptics.web.impact.calledWith('default'));
    });
  });
});
