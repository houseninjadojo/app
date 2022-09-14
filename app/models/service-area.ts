import Model, { attr, hasMany, type AsyncHasMany } from '@ember-data/model';
import ArrayTransform from 'houseninja/transforms/array';
// import type Property from './property';

export default class ServiceAreaModel extends Model {
  @hasMany('property') declare properties: AsyncHasMany<any>;

  @attr('string') declare name: string;
  @attr('string') declare calendarUrl: string;
  @attr('array')  declare zipcodes: ArrayTransform;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
