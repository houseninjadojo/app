import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {
  SIGNUP_ROUTE,
  NATIVE_MOBILE_ROUTE,
} from 'houseninja/data/enums/routes';
import { debug } from '@ember/debug';
import { inject } from './script';
import compact from 'houseninja/utils/compact';
import RouterService from '@ember/routing/router-service';
import User from 'houseninja/models/user';
import Property from 'houseninja/models/property';
import EventBusService from 'houseninja/services/event-bus';

type Args = {
  isOnboardingViaNativeApp: boolean;
  user?: User;
  property?: Property;
  calendarUrl?: string;
};

export default class WalkthroughBookingComponent extends Component<Args> {
  @service declare eventBus: EventBusService;
  @service declare router: RouterService;

  @action
  injectScript(): void {
    inject();
  }

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.setupListeners();
  }

  willDestroy(): void {
    super.willDestroy();
    this.teardownListeners();
  }

  setupListeners(): void {
    this.eventBus.on('window.message', this, this.receiveWindowMessage);
  }

  teardownListeners(): void {
    this.eventBus.off('window.message', this, this.receiveWindowMessage);
  }

  receiveWindowMessage(event: MessageEvent): void {
    if (!this.isHubspotUrl(event.origin)) return;
    if (event.data.meetingBookSucceeded || event.data.meetingCreated) {
      debug(`[hubspot] msg received: ${event.data}`);
      this.onMeetingBooked();
    }
  }

  onMeetingBooked(): void {
    if (this.args.isOnboardingViaNativeApp) {
      this.router.transitionTo(
        NATIVE_MOBILE_ROUTE.ONBOARDING.BOOKING_CONFIRMATION
      );
    } else {
      this.router.transitionTo(SIGNUP_ROUTE.SET_PASSWORD);
    }
  }

  get calendarParams(): string {
    const queryParams = compact({
      firstName: this.args.user?.firstName,
      lastName: this.args.user?.lastName,
      email: this.args.user?.email,
      phone: this.args.user?.phoneNumber,
      address: this.args.property?.streetAddress1,
      address_2: this.args.property?.streetAddress2,
      city: 'Austin', // this.args.property.city,
      state_new: 'Texas', // this.args.property.state,
      zip: this.args.property?.zipcode,
    });
    return new URLSearchParams(queryParams).toString();
  }

  get prepopulatedCalendarUrl(): string {
    return `${this.args.calendarUrl}&${this.calendarParams}`;
  }

  private isHubspotUrl(url: string): boolean {
    const hubspotUrls = [
      'https://local.hubspot.com',
      'https://app.hubspotqa.com',
      'https://app.hubspot.com',
      'https://meetings.hubspot.com',
    ];
    return hubspotUrls.indexOf(url) > -1;
  }
}
