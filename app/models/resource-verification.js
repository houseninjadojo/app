import Model, { attr } from '@ember-data/model';

export default class ResourceVerificationModel extends Model {
  @attr('string') resourceName;
  @attr('string') recordId;
  @attr('string') attribute;
  @attr('string') value;
  @attr('read-only') result;
}
