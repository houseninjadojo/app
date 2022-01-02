import { isAutoInitEnabled } from 'houseninja/utils/native/fcm';
import { module, skip } from 'qunit';

module('Unit | Utility | native/fcm', function () {
  // TODO: Replace this with your real tests.
  skip('it works', async function (assert) {
    let result = await isAutoInitEnabled();
    assert.ok(result);
  });
});
