import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | home', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let serverHome = this.server.create('home');

    let store = this.owner.lookup('service:store');
    // let model = store.createRecord('home', {});
    let model = store.findRecord('home', serverHome.id);
    console.log(model);
    assert.ok(model);
  });
});
