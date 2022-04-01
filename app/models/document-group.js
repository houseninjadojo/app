import Model, { attr, belongsTo } from '@ember-data/model';

export default class DocumentGroupModel extends Model {
  @belongsTo('user') user;

  @attr('string') name;
  @attr('string') description;
  @attr('string') type;
  @attr('string') owner;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
