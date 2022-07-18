import Model, { attr } from '@ember-data/model';

export default class HomeCareTipModel extends Model {
  @attr('string') label;
  @attr('string') description;
  @attr('boolean') showButton;
  @attr('string') defaultHnChatMessage;
  @attr('string') timeOfYear;
  @attr('string') serviceProvider;
  @attr('string') otherProvider;
}
