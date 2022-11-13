import arrayItemsInStr from 'houseninja/utils/array-items-in-str';
import { module, test } from 'qunit';

module('Unit | Utility | array-items-in-str', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    const arr = ['a', 'b', 'c'];
    const result = arrayItemsInStr(arr, 'asdf');
    assert.ok(result);
  });
});
