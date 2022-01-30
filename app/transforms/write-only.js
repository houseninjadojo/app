import Transform from '@ember-data/serializer/transform';
import { isEmpty } from '@ember/utils';

export default class WriteOnlyTransform extends Transform {
  deserialize(/* serialized */) {
    return null;
  }

  serialize(deserialized) {
    if (isEmpty(deserialized)) {
      return null;
    } else {
      return deserialized;
    }
  }
}
