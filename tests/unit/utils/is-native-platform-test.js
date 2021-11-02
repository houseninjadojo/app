import isNativePlatform from 'houseninja/utils/is-native-platform';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { Capacitor } from '@capacitor/core';

module('Unit | Utility | is-native-platform', function (hooks) {
  hooks.beforeEach(function () {
    sinon.stub(Capacitor, 'isNativePlatform').returns(true);
  });

  test('it returns Capacitor#isNativePlatform', function (assert) {
    let result = isNativePlatform();
    assert.true(result);
  });
});
