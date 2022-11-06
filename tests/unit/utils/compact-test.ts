import compact from 'houseninja/utils/compact';
import { module, test } from 'qunit';

module('Unit | Utility | compact', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    const result = compact({ a: 'a', b: undefined, c: 'c' });
    assert.ok(result);
  });
});
