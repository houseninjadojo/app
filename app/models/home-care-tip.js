import Model, { attr } from '@ember-data/model';

export default class HomeCareTipModel extends Model {
  @attr('string') label;
  @attr('string') description;
  @attr('boolean') showButton;
  @attr('string') defaultHnChatMessage;
}
