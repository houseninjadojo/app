import Service from '@ember/service';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

export default class LoaderService extends Service {
  isLoading = false;

  @action
  showGlobalLoadingIndicator(transition) {
    let applicationController = getOwner(this).lookup('controller:application');

    if (!applicationController) {
      return;
    }

    // this.isLoading = true;

    transition.promise.finally(() => {
      // this.isLoading = false;
    });

    return true;
  }
}
