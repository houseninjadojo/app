export function setCursorPosition(inputEl, formatter, delimiter = ' ') {
  const node = inputEl; // vanilla javascript element
  const lastValue = inputEl.value; // get value before formatting
  const formattedValue = formatter(inputEl);
  let cursor = node.selectionStart; // store cursor position
  inputEl.value = formattedValue; // set value to formatted

  // keep the cursor at the end on addition of spaces
  if (cursor === lastValue.length) {
    cursor = formattedValue.length;
    // decrement cursor when backspacing// i.e. "4444 |" => backspace => "4444|"
    if (
      inputEl.getAttribute('data-lastvalue') &&
      inputEl.getAttribute('data-lastvalue').charAt(cursor - 1) == delimiter
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