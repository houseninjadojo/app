import { isBlank, isPresent } from '@ember/utils';

function fmt(code) {
  return isPresent(code) ? code.toUpperCase() : '';
}

export function signupPromoCodeDescription(promoCode) {
  if (isBlank(promoCode)) {
    return '';
  }

  const wordMonths = promoCode.durationInMonths === 1 ? 'month' : 'months';
  const numMonths = isBlank(promoCode.durationInMonths)
    ? 0
    : promoCode.durationInMonths;

  if (promoCode.duration === 'repeating') {
    return [
      `Promo code '${fmt(promoCode.code)}' applied`,
      `and no cost will be charged for ${numMonths} ${wordMonths}.`,
    ].join(', ');
  } else {
    return `Promo code '${fmt(promoCode.code)}' applied.`;
  }
}

export function signupPromoCodeAlert(input, promoCode) {
  if (isBlank(promoCode)) {
    return {
      title: `Promo Code '${fmt(input)}' is not valid`,
      detail: `Please try again with a different code.`,
    };
  } else {
    return null;
  }
}
