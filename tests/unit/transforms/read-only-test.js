import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Transform | read only', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:read-only');
    assert.ok(transform);
  });
});
