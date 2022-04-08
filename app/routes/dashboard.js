import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';
import { SplashScreen } from '@capacitor/splash-screen';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class DashboardRoute extends Route {
  @service current;
  @service session;
  @service store;

  async model() {
    const { user_id } = this.session.data.authenticated.userinfo;
    let user = null;
    let property = null;

    if (isBlank(this.current.user)) {
      user = await this.store.findRecord('user', user_id, {
        include: 'properties',
      });
      property = user.get('properties.firstObject');
    } else {
      property = this.current.user.get('properties.firstObject');
    }

    return RSVP.hash({
      user: this.current.user || user,
      property: this.current.property || property,
      commonRequests: this.store.findAll('common-request', {
        backgroundReload: true,
      }),
      homeCareTips: this.store.findAll('home-care-tip', {
        backgroundReload: true,
      }),
    });
  }

  afterModel() {
    if (isNativePlatform()) {
      SplashScreen.hide();
    }
  }
}
