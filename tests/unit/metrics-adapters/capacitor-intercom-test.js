import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import CapacitorIntercom from 'houseninja/metrics-adapters/capacitor-intercom';

module('Unit | MetricsAdapter | capacitor-intercom', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = new CapacitorIntercom({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
