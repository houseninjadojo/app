import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';

export default class LoaderService extends Service {
  @tracked isLoading = false;

  @action
  setApplicationLoader(transition) {
    let applicationRoute = getOwner(this).lookup('route:application');

    if (!applicationRoute) {
      return;
    }

    this.isLoading = true;

    transition.promise.finally(() => {
      this.isLoading = false;
    });

    return true;
  }
}
