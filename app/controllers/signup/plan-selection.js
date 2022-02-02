import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupPlanSelectionController extends Controller {
  breadcrumbs = breadcrumbs.signUp;
}
