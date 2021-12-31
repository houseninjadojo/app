import { getInfo } from 'houseninja/utils/native/device';
import { module, test } from 'qunit';

module('Unit | Utility | native/device', function () {
  test('getInfo', async function (assert) {
    let result = await getInfo();
    assert.ok(result);
  });
});
