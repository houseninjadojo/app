import { trackCursorPosition } from './track-cursor-position';

export function formatCreditCardNumberElement(inputEl: HTMLInputElement): void {
  trackCursorPosition(inputEl, formatCardNumberElement, '-');
}

export function sanitizeNumber(num: string): string {
  return num.replace(/\D/g, '');
}

function formatCardNumberElement(inputEl: HTMLInputElement) {
  return formatCreditCardNumber(inputEl.value);
}

export function formatCreditCardNumber(cardNumber: string): string {
  const value: string = sanitizeNumber(cardNumber);
  let formattedValue = '';

  // american express, 15 digits
  if (/^3[47]\d{0,13}$/.test(value)) {
    formattedValue = value
      .replace(/(\d{4})/, '$1-')
      .replace(/(\d{4})-(\d{6})/, '$1-$2-');
  } else if (/^\d{0,16}$/.test(value)) {
    // regular cc number, 16 digits
    formattedValue = value
      .replace(/(\d{4})/, '$1-')
      .replace(/(\d{4})-(\d{4})/, '$1-$2-')
      .replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-$2-$3-');
  }
  return formattedValue;
}
