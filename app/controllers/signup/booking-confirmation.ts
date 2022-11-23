import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupBookingConfirmationController extends Controller {
  breadcrumbs = breadcrumbs.walkthrough;
}
