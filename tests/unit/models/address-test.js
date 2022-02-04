import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | address', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function (assert) {
    let record = this.server.create('address');
    let store = this.owner.lookup('service:store');
    let model = store.findRecord('address', record.id);
    assert.ok(model);
  });
});
