import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
import ENV from 'houseninja/config/environment';

import type SessionService from 'houseninja/services/session';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service declare session: SessionService;

  host: string = ENV.apiHost;

  get headers(): Record<string, string> {
    if (this.session.isAuthenticated) {
      return this.session.authenticatedHeaders;
    } else {
      return {};
    }
  }
}
