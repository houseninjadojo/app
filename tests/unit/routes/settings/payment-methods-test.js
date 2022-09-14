import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Route | settings/payment-methods/payment-method/edit',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:settings/payment-methods/payment-method/edit'
      );
      assert.ok(route);
    });
  }
);
