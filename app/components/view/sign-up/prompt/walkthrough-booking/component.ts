import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SignupRoute, OnboardingRoute } from 'houseninja/data/enums/routes';
import RouterService from '@ember/routing/router-service';
import MetricsService from 'houseninja/services/metrics';
import User from 'houseninja/models/user';
import Property from 'houseninja/models/property';
import compact from 'houseninja/utils/compact';
import { inject } from './script';

type Args = {
  isOnboardingViaNativeApp: boolean;
  user?: User;
  property?: Property;
  calendarUrl?: string;
};

export default class WalkthroughBookingComponent extends Component<Args> {
  @service declare metrics: MetricsService;
  @service declare router: RouterService;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    window.addEventListener('message', this.receiveWindowMessage.bind(this));
  }

  willDestroy(): void {
    super.willDestroy();
    window.removeEventListener('message', this.receiveWindowMessage.bind(this));
  }

  @action
  injectScript(): void {
    inject();
  }

  receiveWindowMessage(event: MessageEvent): void {
    if (this.#isHubspotUrl(event.origin)) {
      if (event.data.meetingBookSucceeded || event.data.meetingCreated) {
        this.metrics.trackEvent({
          event: 'signup.meeting.booked',
          properties: { eventData: event.data },
        });
        this.onMeetingBooked();
      }
    }
  }

  onMeetingBooked(): void {
    if (this.args.isOnboardingViaNativeApp) {
      this.router.transitionTo(OnboardingRoute.BookingConfirmation);
    } else {
      this.router.transitionTo(SignupRoute.SetPassword);
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

  get prepopulatedCalendarUrl() {
    return `${this.args.calendarUrl}&${this.calendarParams}`;
  }

  #isHubspotUrl(url: string): boolean {
    const hubspotUrls = [
      'https://local.hubspot.com',
      'https://app.hubspotqa.com',
      'https://app.hubspot.com',
      'https://meetings.hubspot.com',
    ];
    return hubspotUrls.indexOf(url) > -1;
  }
}
