import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | property', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function (assert) {
    let record = this.server.create('property');
    let store = this.owner.lookup('service:store');
    let model = store.findRecord('property', record.id);
    assert.ok(model);
  });
});
