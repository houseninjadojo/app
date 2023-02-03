import { default as UActivityService } from 'ember-user-activity/services/user-activity';
import { service } from '@ember/service';
import { default as IScrollActivityService } from 'ember-user-activity/services/scroll-activity';

export default class UserActivityService extends UActivityService {
  @service('ember-user-activity@scroll-activity')
  declare scrollActivity: IScrollActivityService;

  defaultEvents = [
    'keypress',
    'mouseenter',
    'mousemove',
    'pointerdown',
    'touchstart',
    'mousedown',
  ];
}
