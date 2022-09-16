import Transform from '@ember-data/serializer/transform';
import { isEmpty } from '@ember/utils';

export default class ReadOnlyTransform extends Transform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
