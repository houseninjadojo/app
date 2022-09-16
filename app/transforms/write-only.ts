import Transform from '@ember-data/serializer/transform';
import { isEmpty } from '@ember/utils';

export default class WriteOnlyTransform extends Transform {
  deserialize(/* serialized */): null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize(deserialized: any): any {
    if (isEmpty(deserialized)) {
      return null;
    } else {
      return deserialized;
    }
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'write-only': WriteOnlyTransform;
  }
}
