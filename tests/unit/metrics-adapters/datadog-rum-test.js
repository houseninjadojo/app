import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DatadogRum from 'houseninja/metrics-adapters/datadog-rum';

module('Unit | MetricsAdapter | datadog-rum', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = new DatadogRum({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
