type FormatterFn = (inputEl: HTMLInputElement) => string;

export function trackCursorPosition(
  inputEl: HTMLInputElement,
  formatter: FormatterFn,
  delimiter = ' '
) {
  const node: HTMLInputElement = inputEl; // vanilla javascript element
  const lastValue: string = inputEl.value; // get value before formatting
  const formattedValue: string = formatter(inputEl);
  let cursor: number = node.selectionStart ?? 0; // store cursor position
  inputEl.value = formattedValue; // set value to formatted

  // keep the cursor at the end on addition of spaces
  if (cursor === lastValue.length) {
    cursor = formattedValue.length;
    // decrement cursor when backspacing// i.e. "4444 |" => backspace => "4444|"
    if (
      inputEl.getAttribute('data-lastvalue')?.charAt(cursor - 1) == delimiter
    ) {
      cursor--;
    }
  }

  if (lastValue !== formattedValue) {
    if (
      lastValue.charAt(cursor) == delimiter &&
      formattedValue.charAt(cursor - 1) == delimiter
    ) {
      cursor++;
    }
  }

  // set cursor position
  node.selectionStart = cursor;
  node.selectionEnd = cursor;
  // store last value
  inputEl.setAttribute('data-lastvalue', formattedValue);
}
