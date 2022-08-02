import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'houseninja/tests/helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | signup', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /signup', async function (assert) {
    // try {
    //   await visit('/signup');
    // } catch (e) {
    //   console.log(e);
    // }
    await visit('/signup');
    await percySnapshot('route:signup/index');

    assert.strictEqual(currentURL(), '/signup');
  });
});
