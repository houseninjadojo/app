import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class SignupController extends Controller {
  queryParams = [
    {
      onboardingCode: 'code',
    },
  ];

  @tracked onboardingCode = null;
}
