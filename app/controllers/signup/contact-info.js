import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupContactInfoController extends Controller {
  breadcrumbs = breadcrumbs.signUp;
}
