import { default as UActivityService } from 'ember-user-activity/services/user-activity';

export default class UserActivityService extends UActivityService {
  defaultEvents = [
    'keypress',
    'mouseenter',
    'mousemove',
    'pointerdown',
    'touchstart',
    'mousedown',
  ];
}
