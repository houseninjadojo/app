import Model, { attr } from '@ember-data/model';

export default class ResourceVerificationModel extends Model {
  @attr('string') resourceName;
  @attr('string') recordId;
  @attr('underscore') attribute;
  @attr('string') value;
  @attr('string') vgsValue;
  @attr('read-only') result;
}
