import Transform from '@ember-data/serializer/transform';
import { isEmpty } from '@ember/utils';

export default class ReadOnlyTransform extends Transform {
  deserialize(serialized: any): any | null {
    if (isEmpty(serialized)) {
      return null;
    } else {
      return serialized;
    }
  }

  serialize(/* deserialized */): undefined {
    return undefined;
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'read-only': ReadOnlyTransform;
  }
}
