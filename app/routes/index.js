import { Capacitor } from '@capacitor/core';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { SplashScreen } from '@capacitor/splash-screen';

export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    // we are logged in
    // => go to dashboard.home
    if (this.session.isAuthenticated) {
      this.router.transitionTo('dashboard.home');
      return;
    }

    // are we mobile or web?
    if (Capacitor.isNativePlatform()) {
      // we are NOT logged in
      // but we are on mobile
      // => go to login/signup page
      this.router.transitionTo('login-or-signup');
      SplashScreen.hide();
    } else {
      // we are NOT logged in
      // we are NOT on mobile
      // => go to signup page
      this.router.transitionTo('signup');
    }
  }
}
