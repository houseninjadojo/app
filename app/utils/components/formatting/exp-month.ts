export function formatExpMonth(inputEl: HTMLInputElement): string {
  const value: string = inputEl.value.replace(/\D/g, '');
  let formattedValue: string = value;

  formattedValue = value.replace(/^[0-12]/g, '');
  inputEl.setAttribute('maxlength', '2');

  return formattedValue;
}
