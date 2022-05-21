import { module, skip } from 'qunit';
import { setupTest } from 'houseninja/tests/helpers';

module('Unit | Serializer | resource verification', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('resource-verification');

    assert.ok(serializer);
  });

  skip('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('resource-verification', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
