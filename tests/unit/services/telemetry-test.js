import { module, test } from 'qunit';
import { setupTest } from 'houseninja/tests/helpers';

module('Unit | Service | telemetry', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:telemetry');
    assert.ok(service);
  });
});
