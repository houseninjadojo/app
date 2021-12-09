import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | settings/property', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:settings/property');
    assert.ok(route);
  });
});
