import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import ENV from 'houseninja/config/environment';
import { decamelize } from '@ember/string';
import { pluralize } from 'ember-inflector';

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

  handleResponse(status) {
    if (status === 401 && this.session.isAuthenticated) {
      this.session.invalidate();
    }
    return super.handleResponse(...arguments);
  }

  pathForType(modelName) {
    var decamelized = decamelize(modelName);
    return pluralize(decamelized);
  }
}
