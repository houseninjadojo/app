import { RewriteFrames } from '@sentry/integrations';
import { basename } from '@sentry/utils';
import { isBlank } from '@ember/utils';

import type { StackFrame } from '@sentry/types';

// sentry expects the triple slash for some reason
const prefix = 'app:///';

const iteratee = (frame: StackFrame): StackFrame => {
  // return if the filename is blank
  if (isBlank(frame.filename)) {
    return frame;
  }

  // condense the filename to just the basename
  // e.g. /a/b/c/asdf.js -> asdf.js
  let filename = basename(frame.filename as string);

  // sometimes the filename has a ? at the end of it that throws off the matcher
  // e.g. asdf.js? -> asdf.js
  filename = filename.replace('?', '');

  // put it together
  // e.g. app:///asdf.js
  frame.filename = `${prefix}${filename}`;

  console.log('sentry frame', filename);

  return frame;
};

export default new RewriteFrames({
  // function that takes the frame, applies a transformation, and returns it
  iteratee,
});
