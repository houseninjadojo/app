import { serializeJSON, deserializeJSON } from 'houseninja/utils/serializers';
import { module, test } from 'qunit';

module('Unit | Utility | serializers', function () {
  test('it serializes JSON', function (assert) {
    let result = serializeJSON({ foo: 'bar' });
    assert.strictEqual(result, '{"foo":"bar"}');
  });

  test('it deserializes JSON', function (assert) {
    let result = deserializeJSON('{"foo":"bar"}');
    assert.deepEqual(result, { foo: 'bar' });
  });
});
