export function passwordValidation(fields) {
  const password = fields && fields.filter((f) => f.id === 'password')[0].value;
  const passwordConfirmation =
    fields && fields.filter((f) => f.id === 'passwordConfirmation')[0].value;

  return {
    passwordsMatch:
      password && passwordConfirmation && password === passwordConfirmation,
    atLeastThisLong: password.length >= 12,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!$&.#@]/.test(password),
  };
}
