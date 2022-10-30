import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import type Transition from '@ember/routing/transition';

export default class LoaderService extends Service {
  @tracked isLoading = false;

  @action
  setApplicationLoader(transition: Transition): boolean {
    const applicationRoute = getOwner(this).lookup('route:application');

    if (!applicationRoute) {
      return false;
    }

    this.isLoading = true;

    transition.promise.finally(() => {
      this.isLoading = false;
    });

    return true;
  }
}
