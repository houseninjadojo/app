import { setCursorPosition } from './set-cursor-position';

export function formatCreditCardNumber(inputEl) {
  setCursorPosition(inputEl, formatCardNumber, '-');
}

function formatCardNumber(inputEl) {
  const value = inputEl.value.replace(/\D/g, '');
  let formattedValue;
  let maxLength;
  // american express, 15 digits
  if (/^3[47]\d{0,13}$/.test(value)) {
    formattedValue = value
      .replace(/(\d{4})/, '$1-')
      .replace(/(\d{4})-(\d{6})/, '$1-$2-');
    maxLength = 17;
  } else if (/^\d{0,16}$/.test(value)) {
    // regular cc number, 16 digits
    formattedValue = value
      .replace(/(\d{4})/, '$1-')
      .replace(/(\d{4})-(\d{4})/, '$1-$2-')
      .replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-$2-$3-');
    maxLength = 19;
  }
  inputEl.setAttribute('maxlength', maxLength);
  return formattedValue;
}
