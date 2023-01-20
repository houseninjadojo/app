import { JSONAPISerializer } from 'miragejs';
import { underscore } from '@ember/string';

export default JSONAPISerializer.extend({
  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForAttribute(attr: string): string {
    return underscore(attr);
  },

  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForRelationship(key: string /* , relationship, method */): string {
    return underscore(key);
  },
});
