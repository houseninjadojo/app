import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { getIconUri } from 'houseninja/utils/components/formatting';

import type DocumentGroup from './document-group';
import type Invoice from './invoice';
import type Property from './property';
import type User from './user';

import type WriteOnlyTransform from 'houseninja/transforms/write-only';

export default class DocumentModel extends Model {
  @belongsTo('invoice', { async: true })
  declare invoice: AsyncBelongsTo<Invoice>;

  @belongsTo('property', { async: true })
  declare property: AsyncBelongsTo<Property>;

  @belongsTo('user', { async: true })
  declare user: AsyncBelongsTo<User>;

  @belongsTo('document-group', { async: true })
  declare documentGroup: AsyncBelongsTo<DocumentGroup>;

  @attr('array') declare tags: string[];

  @attr('read-only') declare contentType: string;
  @attr('read-only') declare filename?: string;
  @attr('read-only') declare url: string;
  @attr('string') declare name: string;
  @attr('string') declare description?: string;

  @attr('date') declare createdAt?: Date;
  @attr('date') declare updatedAt?: Date;

  @attr('write-only') declare asset: WriteOnlyTransform;

  get iconUri(): string {
    return getIconUri(this.contentType);
  }

  get group(): Promise<DocumentGroup> {
    return this.documentGroup;
  }

  get isWalkthroughReport(): boolean {
    return this.tags.includes('system:walkthrough-report');
  }

  get isPMReport(): boolean {
    return this.tags.includes('system:preventative-maintenance-plan');
  }
}
