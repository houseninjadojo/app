import Model, { attr, belongsTo } from '@ember-data/model';

export default class HomeModel extends Model {
  @belongsTo('home/address', { async: false, inverse: 'home' }) address;
  @belongsTo('user') user;

  @attr('boolean') default;
  @attr('boolean') selected;
}
