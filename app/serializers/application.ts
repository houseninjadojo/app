import JSONAPISerializer from '@ember-data/serializer/json-api';
import { Snapshot } from '@ember-data/store';
import { underscore } from '@ember/string';
import { isPresent } from '@ember/utils';

export default class ApplicationSerializer extends JSONAPISerializer {
  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForAttribute(attr: string /* , method */): string {
    return underscore(attr);
  }

  /**
   * Map dasherized keys to underscore
   *
   * @example
   *   { "hello-world": "Hello World" } => { "hello_world": "Hello World" }
   */
  keyForRelationship(key: string /* , relationship, method */): string {
    return underscore(key);
  }

  /**
   * Trim null attributes from Ember Data payloads
   *
   * @example
   *   { "a": "b", "c": null } => { "a": "b" }
   */
  serializeAttribute(
    snapshot: Snapshot,
    json: Record<string, unknown>,
    key: string,
    attributes: Record<string, unknown>
  ): void {
    if (isPresent(snapshot.attr(key))) {
      super.serializeAttribute(snapshot, json, key, attributes);
    }
  }
}
