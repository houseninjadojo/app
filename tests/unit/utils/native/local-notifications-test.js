import { checkPermissions } from 'houseninja/utils/native/local-notifications';
import { module, test } from 'qunit';

module('Unit | Utility | native/local-notifications', function () {
  // TODO: Replace this with your real tests.
  test('it works', async function (assert) {
    let result = await checkPermissions();
    assert.ok(result);
  });
});
