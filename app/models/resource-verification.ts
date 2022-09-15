import Model, { attr } from '@ember-data/model';

export default class ResourceVerificationModel extends Model {
  @attr('string') declare resourceName: string;
  @attr('string') declare recordId: string;
  @attr('underscore') declare attribute: string;
  @attr('string') declare value?: string;
  @attr('string') declare vgsValue?: string;
  @attr('read-only') declare result?: boolean;
}
