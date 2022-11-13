import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Sentry from 'houseninja/metrics-adapters/sentry';

module('Unit | MetricsAdapter | sentry', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = new Sentry({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
