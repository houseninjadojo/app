import Store from '@ember-data/store';
import { captureException } from 'houseninja/utils/sentry';

export default class StoreService extends Store {
  async findFirst(modelName) {
    return await this.findAll(modelName).get('firstObject');
  }

  async queryRecord(modelName, query) {
    let records = [];
    try {
      records = await this.query(modelName, query);
    } catch (e) {
      captureException(e);
    }
    if (records.length == 1) {
      return records.get('firstObject');
    } else {
      return null;
    }
  }

  peekFirst(modelName) {
    return this.peekAll(modelName).get('firstObject');
  }
}
