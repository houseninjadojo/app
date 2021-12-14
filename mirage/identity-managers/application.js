import faker from 'faker';

/**
 * Implements UUIDs for all mock models in mirage
 * @see https://www.ember-cli-mirage.com/docs/advanced/mocking-guids
 */
export default class {
  constructor() {
    this.ids = new Set();
  }

  /**
   * Returns an unique identifier.
   *
   * @method fetch
   * @param {Object} data Records attributes hash
   * @return {String} Unique identifier
   * @public
   */
  fetch(/* data */) {
    let uuid = faker.datatype.uuid();
    while (this.ids.has(uuid)) {
      uuid = faker.datatype.uuid();
    }

    this.ids.add(uuid);

    return uuid;
  }

  /**
   * Register an identifier.
   * Must throw if identifier is already used.
   *
   * @method set
   * @param {String} id
   * @public
   */
  set(id) {
    if (this.ids.has(id)) {
      throw new Error(`ID ${id} has already been used.`);
    }

    this.ids.add(id);
  }

  /**
   * Reset identity manager.
   *
   * @method reset
   * @public
   */
  reset() {
    this.ids.clear();
  }
}
