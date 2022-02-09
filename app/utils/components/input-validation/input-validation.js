import { passwordValidation } from './password-validation';

const EMAIL_REGGIE =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PHONE_REGGIE = /^(\d{3})-?(\d{3})-(\d{4})$/;

export function inputValidation(fields, requirementsArray = []) {
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

function isValid(test, fields) {
  switch (test) {
    case 'noEmptyRequiredFields':
      return (
        fields &&
        fields.filter((f) => {
          return f.required && !f.value;
        }).length === 0
      );
    case 'emailIsValid':
      return EMAIL_REGGIE.test(fields.filter((f) => f.id === 'email')[0].value);
    case 'phoneIsValid':
      return PHONE_REGGIE.test(
        fields.filter((f) => f.id === 'phoneNumber')[0].value
      );
    case 'zipcodeIsValid':
      // eslint-disable-next-line no-case-declarations
      const zipcode = fields.filter((f) => f.id === 'zipcode')[0].value;
      return zipcode && zipcode.length >= 5;
    case 'passwordIsValid':
      // eslint-disable-next-line no-case-declarations
      const requirements = passwordValidation(fields);
      return Object.values(requirements).indexOf(false) === -1;
    default:
      return;
  }
}
