import Model, { attr, belongsTo } from '@ember-data/model';
import { getIconUri } from 'houseninja/utils/components/formatting';

export default class DocumentModel extends Model {
  @belongsTo('invoice') invoice;
  @belongsTo('property') property;
  @belongsTo('user') user;
  @belongsTo('document-group') documentGroup;

  @attr('string') contentType;
  @attr('string') filename;
  @attr('string') name;
  @attr('string') description;
  @attr('string') url;
  @attr('string') groupId;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  get iconUri() {
    return getIconUri(this.contentType);
  }
}
