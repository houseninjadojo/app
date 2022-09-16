import Transform from '@ember-data/serializer/transform';
import { underscore } from '@ember/string';

export default class UnderscoreTransform extends Transform {
  deserialize(serialized: string): string {
    return underscore(serialized);
  }

  serialize(deserialized: string): string {
    return underscore(deserialized);
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    underscore: UnderscoreTransform;
  }
}
