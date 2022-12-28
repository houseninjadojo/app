import { setupTest } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | common request model', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function (assert) {
    const model = this.server.create('common-request');
    assert.ok(model);
  });

  test('it has the correct attributes', function (assert) {
    const model = this.server.create('common-request', {
      caption: 'test caption',
      imgURI: 'test imgURI',
      defaultHnChatMessage: 'test defaultHnChatMessage',
    });

    assert.strictEqual(model.caption, 'test caption');
    assert.strictEqual(model.imgURI, 'test imgURI');
    assert.strictEqual(model.defaultHnChatMessage, 'test defaultHnChatMessage');
  });
});
