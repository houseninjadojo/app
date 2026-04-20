import { isBlank, isPresent } from '@ember/utils';
import type PromoCode from 'houseninja/models/promo-code';

function fmt(code: string | undefined) {
  return isPresent(code) ? code.toUpperCase() : '';
}

export function signupPromoCodeDescription(promoCode: PromoCode | undefined) {
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

// TODO where to define this in one place instead of two?
interface PromoCodeAlert {
  title: string;
  detail: string;
}

export function signupPromoCodeAlert(
  input: string | undefined,
  promoCode: PromoCode | undefined
): PromoCodeAlert | undefined {
  if (isBlank(promoCode)) {
    return {
      title: `Promo Code '${fmt(input)}' is not valid`,
      detail: `Please try again with a different code.`,
    };
  } else {
    return undefined;
  }
}
