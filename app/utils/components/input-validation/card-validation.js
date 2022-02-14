export function cardValidation(fields) {
  const cardNumber =
    fields && fields.filter((f) => f.id === 'cardNumber')[0].value;
  const cvv = fields && fields.filter((f) => f.id === 'cvv')[0].value;
  const expMonth = fields && fields.filter((f) => f.id === 'expMonth')[0].value;
  const expYear = fields && fields.filter((f) => f.id === 'expYear')[0].value;
  const zipcode = fields && fields.filter((f) => f.id === 'zipcode')[0].value;

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
