import Model, {
  AsyncBelongsTo,
  AsyncHasMany,
  attr,
  belongsTo,
  hasMany,
} from '@ember-data/model';
import { getIconUri } from 'houseninja/utils/components/formatting';

import type Document from './document';
import type User from './user';

export default class DocumentGroupModel extends Model {
  @belongsTo('user', { async: true, inverse: 'documentGroups' })
  declare user: AsyncBelongsTo<User>;

  @hasMany('document', { async: true, inverse: 'documentGroup' })
  declare documents: AsyncHasMany<Document>;

  @attr('string') declare name: string;
  @attr('string') declare description?: string;
  @attr('string') declare owner?: string;

  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get iconUri(): string {
    return getIconUri('folder');
  }
}
