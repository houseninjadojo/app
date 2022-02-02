import Transform from '@ember-data/serializer/transform';
import { A, isArray } from '@ember/array';

export default class ArrayTransform extends Transform {
  deserialize(serialized) {
    if (isArray(serialized)) {
      return A(serialized);
    } else {
      return A();
    }
  }

  serialize(deserialized) {
    return deserialized;
  }
}
