import { Replay } from '@sentry/browser';

/**
 * Sentry Replay integration
 * @see https://github.com/getsentry/sentry-javascript/tree/master/packages/replay#sentry-session-replay
 */

const config = {
  // Keep track of the user across page loads.
  // Note a single user using multiple tabs will result in multiple sessions.
  // Closing a tab will result in the session being closed as well.
  stickySession: true,

  // Mask all text content. Will pass text content through `maskTextFn` before sending to server.
  maskAllText: false,

  // Mask values of `<input>` elements. Passes input values through `maskInputFn` before sending to server.
  maskAllInputs: true,

  // Block all media elements (`img`, `svg`, `video`, `object`, `picture`, `embed`, `map`, `audio`)
  blockAllMedia: false,
};

export default new Replay(config);
