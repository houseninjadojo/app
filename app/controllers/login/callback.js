import Controller from '@ember/controller';

export default class LoginCallbackController extends Controller {
  queryParams = ['state', 'code'];

  state = null;
  code = null;
}
