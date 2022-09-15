import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';

import type Document from './document';
import type ServiceArea from './service-area';
import type User from './user';
import type WorkOrder from './work-order';

export default class PropertyModel extends Model {
  @belongsTo('service-area', { async: true })
  declare serviceArea: AsyncBelongsTo<ServiceArea>;

  @belongsTo('user', { async: true })
  declare user: AsyncBelongsTo<User>;

  @hasMany('document', { async: true })
  declare documents: AsyncHasMany<Document>;

  @hasMany('work-order', { async: true })
  declare workOrders: AsyncHasMany<WorkOrder>;

  @attr('string') declare streetAddress1: string;
  @attr('string') declare streetAddress2?: string;
  @attr('string') declare city: string;
  @attr('string') declare state: string;
  @attr('string') declare zipcode: string;

  @attr('number') declare lotSize?: number;
  @attr('number') declare homeSize?: number;
  @attr('number') declare garageSize?: number;
  @attr('number') declare yearBuilt?: number;
  @attr('string') declare estimatedValue?: string;
  @attr('number') declare bedrooms?: number;
  @attr('number') declare bathrooms?: number;
  @attr('number') declare pools?: number;

  @attr('boolean', { defaultValue: false }) declare default: boolean;
  @attr('boolean', { defaultValue: false }) declare selected: boolean;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;
}
