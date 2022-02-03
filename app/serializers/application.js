import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class ApplicationSerializer extends JSONAPISerializer {
  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForAttribute(attr /* , method */) {
    return underscore(attr);
  }
}
