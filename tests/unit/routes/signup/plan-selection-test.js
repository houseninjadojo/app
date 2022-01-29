import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | signup/plan-selection', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:signup/plan-selection');
    assert.ok(route);
  });
});
