import Store from '@ember-data/store';
import { captureException } from 'houseninja/utils/sentry';

import type Model from '@ember-data/model';

export default class StoreService extends Store {
  async findFirst(modelName: string): Promise<void> {
    return await this.findAll(modelName).get('firstObject');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async queryRecord(modelName, query): Promise<Model | undefined> {
    let records = [];
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      records = await this.query(modelName, query);
    } catch (e) {
      captureException(e as Error);
    }
    if (records.length == 1) {
      return records.get('firstObject');
    } else {
      return;
    }
  }

  peekFirst(modelName: string): Model | undefined {
    return this.peekAll(modelName).get('firstObject');
  }
}
