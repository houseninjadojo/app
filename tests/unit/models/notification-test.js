import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Notification from 'houseninja/models/notification';

module('Unit | Model | notification', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let model = new Notification();
    assert.ok(model);
  });
});
