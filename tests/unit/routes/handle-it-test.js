import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | handle-it', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:handle-it');
    assert.ok(route);
  });
});
