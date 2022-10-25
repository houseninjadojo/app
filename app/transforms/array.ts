import Transform from '@ember-data/serializer/addon';
import { isArray } from '@ember/array';
import { TrackedArray } from 'tracked-built-ins';

export default class ArrayTransform extends Transform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(serialized: Array<any>): TrackedArray<any> {
    if (isArray(serialized)) {
      return new TrackedArray(serialized);
    } else {
      return new TrackedArray();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize(deserialized: TrackedArray<any>): Array<any> {
    return deserialized;
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    array: ArrayTransform;
  }
}
