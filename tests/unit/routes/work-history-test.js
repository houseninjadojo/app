import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | work-history', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:work-history');
    assert.ok(route);
  });
});
