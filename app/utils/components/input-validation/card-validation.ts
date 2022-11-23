import type { Field } from 'houseninja/app/components';

type CardValidation = {
  creditCardIsValid: boolean;
  cvvIsValid: boolean;
  monthIsValid: boolean;
  yearIsValid: boolean;
  zipcodeIsValid: boolean;
};

export function cardValidation(fields: Field[]): CardValidation {
  const cardNumber =
    fields?.find((f) => f.id === 'cardNumber')?.value?.toString() ?? '';
  const cvv = fields.find((f) => f.id === 'cvv')?.value?.toString() ?? '';
  const expMonth =
    fields.find((f) => f.id === 'expMonth')?.value?.toString() ?? '';
  const expYear =
    fields.find((f) => f.id === 'expYear')?.value?.toString() ?? '';
  const zipcode =
    fields.find((f) => f.id === 'zipcode')?.value?.toString() ?? '';

  // @todo
  // this is pretty gnarly
  return {
    creditCardIsValid:
      /^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/.test(cardNumber) ||
      /^(\d{4})-(\d{6})-(\d{5})$/.test(cardNumber),
    cvvIsValid: /^(\d{3,4})$/.test(cvv),
    monthIsValid: /^(\d{2})$/.test(expMonth),
    yearIsValid: /^(\d{2}|\d{4})$/.test(expYear),
    zipcodeIsValid: /^(\d{5})$/.test(zipcode),
    //agreedToTerms: true,
  };
}
