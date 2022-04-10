import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { getIconUri } from 'houseninja/utils/components/formatting';

export default class DocumentGroupModel extends Model {
  @belongsTo('user') user;
  @hasMany('document') documents;

  @attr('string') name;
  @attr('string') description;
  @attr('string') owner;

  @attr('date') createdAt;
  @attr('date') updatedAt;

  get iconUri() {
    return getIconUri('folder');
  }
}
