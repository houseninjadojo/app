import { module, test } from 'qunit';
import { setupTest } from 'houseninja/tests/helpers';

module('Unit | Service | event-bus', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const service = this.owner.lookup('service:event-bus');
    assert.ok(service);
  });
});
