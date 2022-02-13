import Model, { attr } from '@ember-data/model';

export default class CommonRequestModel extends Model {
  @attr('string') caption;
  @attr('string') imgURI;
  @attr('string') defaultHnChatMessage;
}
