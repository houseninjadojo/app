import Model, { attr, belongsTo } from '@ember-data/model';

export default class LineItemModel extends Model {
  @belongsTo('invoice') invoice;

  @attr('string') amount;
  @attr('string') description;
  @attr('string') name;
  @attr('string') quantity;
}
