import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DatadogLogs from 'houseninja/metrics-adapters/datadog-logs';

module('Unit | MetricsAdapter | datadog-logs', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = new DatadogLogs({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
