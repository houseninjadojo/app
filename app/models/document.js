import Model, { attr, belongsTo } from '@ember-data/model';
import { getIconUri } from 'houseninja/utils/components/formatting';

export default class DocumentModel extends Model {
  @belongsTo('invoice') invoice;
  @belongsTo('property') property;
  @belongsTo('user') user;
  @belongsTo('document-group') documentGroup;

  @attr('array') tags;

  @attr('string') contentType;
  @attr('string') filename;
  @attr('string') name;
  @attr('string') description;
  @attr('string') url;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  get iconUri() {
    return getIconUri(this.contentType);
  }

  get group() {
    return this.documentGroup;
  }

  get isWalkthroughReport() {
    return this.tags.includes('system:walkthrough-report');
  }

  get isPMReport() {
    return this.tags.includes('system:preventative-maintenance-plan');
  }
}
