import getPlatform from 'app/utils/get-platform';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { Capacitor } from '@capacitor/core';

module('Unit | Utility | get-platform', function (hooks) {
  hooks.beforeEach(function () {
    sinon.stub(Capacitor, 'getPlatform').returns('ios');
  });

  test('it returns Capacitor#getPlatform', function (assert) {
    let result = getPlatform();
    assert.equal(result, 'ios');
  });
});
