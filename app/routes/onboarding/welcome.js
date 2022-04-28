import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { WELCOME } from 'houseninja/data/enums/onboarding-step';

export default class OnboardingWelcomeRoute extends Route {
  @service onboarding;
  @service router;

  activate() {
    // this is a workaround for "disabling" the back button
    // notes:
    //  - this does not work when resuming a login navigates diretly to this page (WELCOME)
    //  - it needs at least one more page to have been navigated through (i.e. starting
    //    from the first page, or clicking next and then back)
    //  - adding more calls to "pushState" does not fix the above issue
    //  - i make no claims to its stability, this is walking the line of prohibited browser
    //    behavior and any browser may break this at any time
    //
    // first we want to add an extra history entry that can be safely navigated to
    // while the event fires
    history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      // set the step here, otherwise it triggers two extra "completeStep" calls
      this.onboarding.currentStep = WELCOME;
      // now return from the fake history page to this page (signup/welcome)
      history.forward();
    };
  }

  deactivate() {
    // disable this listener when the route is navigated away from
    window.onpopstate = () => null;
    this.onboarding.completeStep(WELCOME);
  }
}
