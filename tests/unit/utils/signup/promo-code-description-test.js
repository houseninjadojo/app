import {
  signupPromoCodeDescription,
  signupPromoCodeAlert,
} from 'houseninja/utils/signup/promo-code-description';
import { module, test } from 'qunit';

module('Unit | Utility | signup/promo-code-description', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let result = signupPromoCodeDescription();
    let result2 = signupPromoCodeAlert();
    assert.ok(result);
    assert.ok(result2);
  });
});
