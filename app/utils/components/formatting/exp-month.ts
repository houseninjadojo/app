export function formatExpMonth(inputEl: HTMLInputElement): string {
  const value: string = inputEl.value;
  let formattedValue: string = value;

  formattedValue = value.replace(/\D/g, '');
  inputEl.setAttribute('maxlength', '2');

  inputEl.value = formattedValue;
  return formattedValue;
}
