import randomString from 'houseninja/utils/random-string';
import { module, test } from 'qunit';

module('Unit | Utility | random-string', function () {
  test('it returns a random string', function (assert) {
    let result1 = randomString();
    let result2 = randomString();
    assert.strictEqual(typeof result1, 'string');
    assert.strictEqual(typeof result2, 'string');
    assert.ok(result1.length > 0);
    assert.ok(result2.length > 0);
    assert.notStrictEqual(result1, result2);
  });
});
