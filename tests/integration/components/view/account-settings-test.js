import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { stubService } from '@glimmer/tracking';

module('Integration | Component | View | account-settings', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<View::AccountSettings />`);
    assert.dom(this.element).containsText('Account Settings');
  });

  skip('it sets userHasPromoCode to true when the current user has a promo code', async function (assert) {
    let currentStub = stubService('current', {
      user: {
        promoCode: {
          code: 'promo123',
        },
      },
    });
    this.owner.register('service:current', currentStub);

    await render(hbs`<View::AccountSettings />`);
    assert.dom(this.element).hasClass('hn-referral-code');
  });

  skip('it sets userHasPromoCode to false when the current user does not have a promo code', async function (assert) {
    let currentStub = stubService('current', {
      user: {
        promoCode: {
          code: null,
        },
      },
    });
    this.owner.register('service:current', currentStub);

    await render(hbs`<View::AccountSettings />`);
    assert.dom(this.element).doesNotHaveClass('hn-referral-code');
  });
});
