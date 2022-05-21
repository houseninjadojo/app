import Transform from '@ember-data/serializer/transform';
import { underscore } from '@ember/string';

export default class UnderscoreTransform extends Transform {
  deserialize(serialized) {
    return underscore(serialized);
  }

  serialize(deserialized) {
    return underscore(deserialized);
  }
}
