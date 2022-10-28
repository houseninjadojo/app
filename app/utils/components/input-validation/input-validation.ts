import { passwordValidation, cardValidation } from '.';

import type { Field } from 'houseninja/app/components';

type ValidationObject = {
  isInvalid: boolean;
  requirements: {
    [k: string]: boolean | '' | undefined;
  };
};

const EMAIL_REGGIE =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PHONE_REGGIE = /^(\d{3})-?(\d{3})-(\d{4})$/;

// eslint-disable-next-line prettier/prettier
export function inputValidation(fields: Field[], requirementsArray: string[] = []): ValidationObject {
  const ALL_REQS = {
    noEmptyRequiredFields: isValid('noEmptyRequiredFields', fields),
    emailIsValid:
      !requirementsArray.includes('emailIsValid') ||
      isValid('emailIsValid', fields),
    phoneIsValid:
      !requirementsArray.includes('phoneIsValid') ||
      isValid('phoneIsValid', fields),
    zipcodeIsValid:
      !requirementsArray.includes('zipcodeIsValid') ||
      isValid('zipcodeIsValid', fields),
    passwordIsValid:
      !requirementsArray.includes('passwordIsValid') ||
      isValid('passwordIsValid', fields),
    cardIsValid:
      !requirementsArray.includes('cardIsValid') ||
      isValid('cardIsValid', fields),
  };

  const actualRequirements = Object.entries(ALL_REQS).filter((entry) => {
    const array = ['noEmptyRequiredFields', ...requirementsArray];
    return array.includes(entry[0]);
  });

  const validationObject = {
    isInvalid: true,
    requirements: Object.fromEntries(actualRequirements),
  };

  const allRequirementsMet =
    Object.values(validationObject.requirements).indexOf(false) === -1;

  validationObject.isInvalid = !allRequirementsMet;
  return validationObject;
}

function isValid(test: string, fields: Field[]): boolean {
  switch (test) {
    case 'noEmptyRequiredFields':
      return (
        fields?.find((f) => {
          return f.required && !f.value;
        }) === undefined
      );
    case 'emailIsValid':
      return EMAIL_REGGIE.test(
        fields?.find((f) => f.id === 'email')?.value?.toString() ?? ''
      );
    case 'phoneIsValid':
      return PHONE_REGGIE.test(
        fields?.find((f) => f.id === 'phoneNumber')?.value?.toString() ?? ''
      );
    case 'zipcodeIsValid': {
      const zipcode =
        fields?.find((f) => f.id === 'zipcode')?.value?.toString() ?? '';
      return zipcode?.length >= 5 ?? false;
    }
    case 'passwordIsValid':
      return Object.values(passwordValidation(fields)).indexOf(false) === -1;
    case 'cardIsValid':
      return Object.values(cardValidation(fields)).indexOf(false) === -1;
    default:
      return false;
  }
}
