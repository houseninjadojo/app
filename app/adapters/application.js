import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
import ENV from 'houseninja/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  host = ENV.apiHost;

  get headers() {
    if (this.session.isAuthenticated) {
      return this.session.authenticatedHeaders;
    } else {
      return {};
    }
  }
}
