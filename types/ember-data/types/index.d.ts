import type Model from '@ember-data/model';
// import type RelationshipsFor from '@ember-data/model';

declare module 'ember-data' {
  namespace DS {
    interface RelationshipOptions<M extends Model> {
      async?: boolean | undefined;
      // inverse?: RelationshipsFor<M> | null | undefined;
      inverse?: Exclude<keyof M, keyof Model> | null | undefined;
      polymorphic?: boolean | undefined;
      as?: string | undefined;
    }
  }
}
