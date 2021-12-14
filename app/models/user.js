import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  // use belongsTo for a one-to-one relationship for now
  // eventually we will want this to be a hasMany
  @belongsTo('property') property;

  @attr('string') email;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') phoneNumber;
}
