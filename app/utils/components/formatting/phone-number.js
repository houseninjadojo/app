import { trackCursorPosition } from './track-cursor-position';

export function formatPhoneNumber(inputEl) {
  trackCursorPosition(inputEl, formatPhone, '-');
}

function formatPhone(inputEl) {
  var value = inputEl.value.replace(/\D/g, '');
  var formattedValue;

  formattedValue = value
    .replace(/(\d{3})/, '$1-')
    .replace(/(\d{3})-(\d{3})/, '$1-$2-');
  inputEl.setAttribute('maxlength', 12);

  return formattedValue;
}
