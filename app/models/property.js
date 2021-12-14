import Model, { attr, belongsTo } from '@ember-data/model';

export default class PropertyModel extends Model {
  @belongsTo('user') user;

  // Address Info
  @attr('string') line1;
  @attr('string') line2;
  @attr('string') city;
  @attr('string') state;
  @attr('string') postalCode;

  @attr('boolean') default;
  @attr('boolean') selected;
}
