import { checkPermissions } from 'houseninja/utils/native/push-notifications';
import { module, skip } from 'qunit';

module('Unit | Utility | native/push-notifications', function () {
  // This requires running on a non-web platform
  // until then, skip
  skip('it works', async function (assert) {
    let result = await checkPermissions();
    assert.ok(result);
  });
});
