import Controller from '@ember/controller';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignupAreaNotificationController extends Controller {
  breadcrumbs = breadcrumbs.serviceArea;
}
