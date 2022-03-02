import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';
import { isPresent } from '@ember/utils';

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

  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForRelationship(key /* , relationship, method */) {
    return underscore(key);
  }

  /**
   * Trim null attributes from Ember Data payloads
   *
   * @example
   *   { "a": "b", "c": null } => { "a": "b" }
   */
  serializeAttribute(snapshot, _, key) {
    if (isPresent(snapshot.attr(key))) {
      super.serializeAttribute(...arguments);
    }
  }
}
