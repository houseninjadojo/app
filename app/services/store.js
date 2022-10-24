import Store from '@ember-data/store';
import { captureException } from 'houseninja/utils/sentry';

export default class StoreService extends Store {
  async findFirst(modelName) {
    const found = await this.findAll(modelName);
    return found[0];
  }

  async queryRecord(modelName, query) {
    let records = [];
    try {
      records = await this.query(modelName, query);
    } catch (e) {
      captureException(e);
    }
    if (records.length == 1) {
      return records[0];
    } else {
      return null;
    }
  }

  peekFirst(modelName) {
    const modelInstances = this.peekAll(modelName);
    return modelInstances[0];
  }
}
