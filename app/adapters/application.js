import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import ENV from 'houseninja/config/environment';
import Sentry from 'houseninja/utils/sentry';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  host = ENV.apiHost;

  // eslint-disable-next-line
  @computed('session.{data.authenticated.access_token,isAuthenticated}')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // eslint-disable-next-line
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }
    return headers;
  }

  async queryRecord(modelName, query) {
    let records = [];
    try {
      records = await this.store.query(modelName, query);
    } catch (e) {
      Sentry.captureException(e);
    }
    if (records.length == 1) {
      return records.get('firstObject');
    } else {
      return null;
    }
  }
}
