import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

import type AnalyticsService from 'houseninja/services/analytics';
import type CurrentService from 'houseninja/services/current';
import type HapticsService from 'houseninja/services/haptics';
import type IntercomService from 'houseninja/services/intercom';
import type RouterService from '@ember/routing/router-service';
import type ViewService from 'houseninja/services/view';

import type User from 'houseninja/models/user';
import type Property from 'houseninja/models/property';
import type HomeCareTip from 'houseninja/models/home-care-tip';

type Args = {
  user: User;
  property?: Property;
  homeCareTips: HomeCareTip[];
};

export default class HomeContentComponent extends Component<Args> {
  @service declare analytics: AnalyticsService;
  @service declare current: CurrentService;
  @service declare haptics: HapticsService;
  @service declare intercom: IntercomService;
  @service declare router: RouterService;
  @service declare view: ViewService;

  documentVaultRoute = NATIVE_MOBILE_ROUTE.VAULT.INDEX;
  walkthroughBookingRoute = NATIVE_MOBILE_ROUTE.ONBOARDING.WALKTHROUGH_BOOKING;

  get user(): User {
    return this.args.user;
  }

  get streetAddress(): string | undefined {
    return (
      this.args.property?.get('streetAddress1') ||
      this.current?.property?.get('streetAddress1')
    );
  }

  get salutation(): string {
    const myDate = new Date();
    const hrs = myDate.getHours();

    let greet;

    if (hrs < 12) greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening';

    return `${greet}${this.user ? ', ' + this.user.firstName : ''}!`;
  }

  get prompt(): string {
    return `What can we help you with at ${!this.streetAddress ? 'home?' : ''}`;
  }

  get weeklyHomeCareTip(): HomeCareTip | undefined {
    return this.args.homeCareTips[0];
  }
  @action
  async selectRoute(route: string): Promise<void> {
    this.haptics.giveFeedback();
    if (route === this.documentVaultRoute) {
      this.view.preservePreviousRoute(this.router);
    } else if (route === this.walkthroughBookingRoute) {
      this.view.preservePreviousRoute(this.router);
    }
    this.router.transitionTo(route);
  }

  @action
  async openChatModal(): Promise<void> {
    this.intercom.showComposer('I’d like to request a service.');
  }
}
