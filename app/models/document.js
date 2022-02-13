import Model, { attr, belongsTo } from '@ember-data/model';

export default class DocumentModel extends Model {
  @belongsTo('invoice') invoice;
  @belongsTo('property') property;
  @belongsTo('user') user;

  @attr('string') contentType;
  @attr('string') filename;
  @attr('string') url;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
