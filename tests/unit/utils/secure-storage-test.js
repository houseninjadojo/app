import SecureStorage from 'houseninja/utils/secure-storage';
import { module, test } from 'qunit';

module('Unit | Utility | secure-storage', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let result = SecureStorage.set('a', 'b');
    assert.ok(result);
  });
});
