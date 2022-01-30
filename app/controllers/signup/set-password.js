import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupSetPasswordController extends Controller {
  breadcrumbs = breadcrumbs.password;
}
