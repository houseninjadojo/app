import Transform from '@ember-data/serializer/transform';
import { isEmpty } from '@ember/utils';

export default class ReadOnlyTransform extends Transform {
  deserialize(serialized) {
    if (isEmpty(serialized)) {
      return null;
    } else {
      return serialized;
    }
  }

  serialize(/* deserialized */) {
    return undefined;
  }
}
