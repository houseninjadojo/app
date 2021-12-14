import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | user', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let record = this.server.create('user');
    let store = this.owner.lookup('service:store');
    let model = store.findRecord('user', record.id);
    assert.ok(model);
  });
});
