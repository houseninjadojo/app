import Model, { attr } from '@ember-data/model';

export interface Detail {
  name: string;
}

export default class ServiceCategoryModel extends Model {
  @attr('string') declare name: string;
  @attr('array') declare details: Array<Detail>;
}
