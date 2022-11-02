import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import CapacitorMixpanel from 'houseninja/metrics-adapters/capacitor-mixpanel';

module('Unit | MetricsAdapter | capacitor-mixpanel', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = new CapacitorMixpanel({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
