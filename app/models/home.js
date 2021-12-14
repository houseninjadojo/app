import Model, { attr, belongsTo } from '@ember-data/model';

export default class HomeModel extends Model {
  @belongsTo('home/address') address;
  @belongsTo('user') user;

  @attr('boolean') default;
  @attr('boolean') selected;
}
