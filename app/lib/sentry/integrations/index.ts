import CaptureConsole from './capture-console';
import RewriteFrames from './rewrite-frames';
import Replay from './sentry-replay';
import ExtraErrorData from './extra-error-data';
import HTTPClient from './http-client';

export default [
  CaptureConsole,
  ExtraErrorData,
  HTTPClient,
  RewriteFrames,
  Replay,
];
