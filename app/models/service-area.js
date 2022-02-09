import Model, { attr, hasMany } from '@ember-data/model';

export default class ServiceAreaModel extends Model {
  @hasMany('property') properties;

  @attr('string') name;
  @attr('array') zipcodes;
  @attr('string') calendarUrl;

  @attr('date') createdAt;
  @attr('date') updatedAt;
}
