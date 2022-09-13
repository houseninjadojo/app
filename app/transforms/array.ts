import Transform from '@ember-data/serializer/transform';
import { A, isArray } from '@ember/array';

export default class ArrayTransform extends Transform {
  deserialize(serialized: Array<any>): Array<any> {
    if (isArray(serialized)) {
      return A(serialized);
    } else {
      return A();
    }
  }

  serialize(deserialized: Array<any>): Array<any> {
    return deserialized;
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'array': ArrayTransform;
  }
}
