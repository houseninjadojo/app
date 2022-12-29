import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import CurrentService from 'houseninja/services/current';
import RouterService from '@ember/routing/router-service';
import StoreService from 'houseninja/services/store';
import TelemetryService from 'houseninja/services/telemetry';

export default class AreaNotificationComponent extends Component {
  @service declare current: CurrentService;
  @service declare router: RouterService;
  @service declare store: StoreService;
  @service declare telemetry: TelemetryService;

  @tracked email = '';
  @tracked userSubmittedEmail = false;
  @tracked isLoading = false;

  @action
  async saveUserEmail(): Promise<boolean> {
    this.isLoading = true;
    const zipcode = this.current.signup.zipcode;
    const user = this.store.createRecord('user', {
      email: this.email,
      requestedZipcode: zipcode,
    });
    try {
      await user.save();
      this.userSubmittedEmail = true;
      return true;
    } catch (e) {
      this.telemetry.captureException(e as Error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
