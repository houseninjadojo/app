import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import ENV from 'dojo/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service auth;

  host = ENV.apiHost;

  @computed('auth.{tokens.access_token,isAuthenticated}')
  get headers() {
    let headers = {};
    if (this.auth.isAuthenticated) {
      // eslint-disable-next-line
      headers['Authorization'] = `Bearer ${this.auth.tokens.access_token}`;
    }
    return headers;
  }

  handleResponse(status) {
    if (status === 401 && this.auth.isAuthenticated) {
      this.auth.invalidate();
    }
    return super.handleResponse(...arguments);
  }
}
