import { trackCursorPosition } from './track-cursor-position';

export function formatExpMonth(inputEl: HTMLInputElement): string {
  return trackCursorPosition(inputEl, _formatExpMonth);
}

export function _formatExpMonth(inputEl: HTMLInputElement): string {
  const value: string = inputEl.value;
  let formattedValue: string = value;

  formattedValue = value.replace(/\D/g, '');
  inputEl.setAttribute('maxlength', '2');

  return formattedValue;
}
