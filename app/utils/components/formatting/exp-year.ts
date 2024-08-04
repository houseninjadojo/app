export function formatExpYear(inputEl: HTMLInputElement): string {
  const value: string = inputEl.value;
  let formattedValue: string = value;

  formattedValue = value.replace(/\D/g, '');
  inputEl.setAttribute('maxlength', '4');

  inputEl.value = formattedValue;
  return formattedValue;
}
