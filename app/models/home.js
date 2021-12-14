import Model, { attr, belongsTo } from '@ember-data/model';

export default class HomeModel extends Model {
  @belongsTo('homeAddress') address;
  @belongsTo('user') user;

  @attr('boolean') default;
  @attr('boolean') selected;
}
