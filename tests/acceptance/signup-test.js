import { module, test, skip } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { Preferences } from '@capacitor/preferences';
import { setupApplicationTest } from 'houseninja/tests/helpers';
import percySnapshot from '@percy/ember';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Signup', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signup', async function (assert) {
    await visit('/signup');
    await percySnapshot('route:signup/index');

    assert.strictEqual(currentURL(), '/signup');
  });

  module('Session Storage Rehydration', function () {
    skip('signup stashes using local storage', async function (assert) {
      await visit('/signup');
      await fillIn('.hn-input', '78702');
      await click('div.action.single > button');

      const payload = await Preferences.get('zipcode');
      console.log(JSON.stringify(localStorage));
      assert.strictEqual(payload.value, '78702');
    });
  });

  module('Subscribed Gate', function () {
    test('signup/welcome should redirect to signup/payment-method if not subscribed', async function (assert) {
      let onboarding = this.owner.lookup('service:onboarding');
      onboarding.isSubscribed = () => false;

      await visit('/signup/welcome');
      assert.strictEqual(currentURL(), '/signup/payment-method');
      await percySnapshot('route:signup/payment-method');
    });

    test('signup/walkthrough-booking should redirect to signup/payment-method if not subscribed', async function (assert) {
      let onboarding = this.owner.lookup('service:onboarding');
      onboarding.isSubscribed = () => false;

      await visit('/signup/walkthrough-booking');
      assert.strictEqual(currentURL(), '/signup/payment-method');
    });

    test('signup/set-password should redirect to signup/payment-method if not subscribed', async function (assert) {
      let onboarding = this.owner.lookup('service:onboarding');
      onboarding.isSubscribed = () => false;

      await visit('/signup/set-password');
      assert.strictEqual(currentURL(), '/signup/payment-method');
    });

    test('signup/booking-confirmation should redirect to signup/payment-method if not subscribed', async function (assert) {
      let onboarding = this.owner.lookup('service:onboarding');
      onboarding.isSubscribed = () => false;

      await visit('/signup/booking-confirmation');
      assert.strictEqual(currentURL(), '/signup/payment-method');
    });

    test('signup/property-info should redirect to signup/payment-method if not subscribed', async function (assert) {
      let onboarding = this.owner.lookup('service:onboarding');
      onboarding.isSubscribed = () => false;

      await visit('/signup/property-info');
      assert.strictEqual(currentURL(), '/signup/payment-method');
    });
  });
});
