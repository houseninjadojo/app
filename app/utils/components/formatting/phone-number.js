import { setCursorPosition } from './set-cursor-position';

export function formatCreditCardNumber(inputEl) {
  setCursorPosition(inputEl, formatPhoneNumber, '-');
}

function formatPhoneNumber(inputEl) {
  var value = inputEl.value.replace(/\D/g, '');
  var formattedValue;

  formattedValue = value
    .replace(/(\d{3})/, '$1-')
    .replace(/(\d{3})-(\d{3})/, '$1-$2-');
  inputEl.setAttribute('maxlength', 12);

  return formattedValue;
}
