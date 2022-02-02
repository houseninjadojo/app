import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupPropertyInfoController extends Controller {
  breadcrumbs = breadcrumbs.walkthrough;
}
