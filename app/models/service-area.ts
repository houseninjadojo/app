import Model, { attr, hasMany, type AsyncHasMany } from '@ember-data/model';

import type Property from './property';

export default class ServiceAreaModel extends Model {
  @hasMany('property', { async: true, inverse: 'serviceArea' })
  declare properties: AsyncHasMany<Property>;

  @attr('string') declare name: string;
  @attr('string') declare calendarUrl: string;
  @attr('array') declare zipcodes: string[];

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
