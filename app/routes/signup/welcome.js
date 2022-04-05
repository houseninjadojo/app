import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WELCOME } from 'houseninja/data/enums/onboarding-step';

export default class SignupWelcomeRoute extends Route {
  @service onboarding;
  @service router;

  activate() {
    console.log('activated');
    // window.addEventListener('popstate', this.handlePopstate.bind(this));
  }

  deactivate() {
    console.log('deactivated');
    // window.removeEventListener('popstate', this.handlePopstate.bind(this));
    this.onboarding.completeStep(WELCOME);
  }

  willTransition(transition) {
    console.log('transition to: ', transition.to.name);
    console.log(transition);
    transition.abort();
    // if (transition.to)
  }

  handlePopstate(event) {
    console.log(event);
    event.preventDefault();
    history.go(1);
    // this.router.transitionTo();
  }
}
