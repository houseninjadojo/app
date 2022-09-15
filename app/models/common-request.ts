import Model, { attr } from '@ember-data/model';

export default class CommonRequestModel extends Model {
  @attr('string') declare caption: string;
  @attr('string') declare imgURI: string;
  @attr('string') declare defaultHnChatMessage: string;
}
