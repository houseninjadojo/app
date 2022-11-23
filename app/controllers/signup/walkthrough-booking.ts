import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupWalkthroughBookingController extends Controller {
  breadcrumbs = breadcrumbs.walkthrough;
}
