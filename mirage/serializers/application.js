import { JSONAPISerializer } from 'miragejs';
import { underscore } from '@ember/string';

export default JSONAPISerializer.extend({
  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForAttribute(attr) {
    return underscore(attr);
  },

  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForRelationship(key /* , relationship, method */) {
    return underscore(key);
  },
});
