import { trackCursorPosition } from './track-cursor-position';

export function formatPhoneNumber(inputEl: HTMLInputElement): void {
  trackCursorPosition(inputEl, formatPhone, '-');
}

function formatPhone(inputEl: HTMLInputElement): string {
  const value: string = inputEl.value.replace(/\D/g, '');
  let formattedValue: string = value;

  formattedValue = value
    .replace(/(\d{3})/, '$1-')
    .replace(/(\d{3})-(\d{3})/, '$1-$2-');
  inputEl.setAttribute('maxlength', '12');

  return formattedValue;
}
