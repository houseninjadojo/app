import type { Field } from 'houseninja/app/components';

type PasswordValidation = {
  passwordsMatch: boolean;
  atLeastThisLong: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
};

export function passwordValidation(fields: Field[]): PasswordValidation {
  const password =
    fields.find((f) => f.id === 'password')?.value?.toString() ?? '';
  const passwordConfirmation =
    fields.find((f) => f.id === 'passwordConfirmation')?.value?.toString() ??
    '';

  return {
    passwordsMatch: password === passwordConfirmation ?? false,
    atLeastThisLong: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!$&.#@]/.test(password),
  };
}
