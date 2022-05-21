import { module, test } from 'qunit';
import { setupTest } from 'houseninja/tests/helpers';

module('Unit | Transform | underscore', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:underscore');
    assert.ok(transform);
  });
});
