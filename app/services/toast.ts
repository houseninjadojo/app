import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ToastType } from 'houseninja/data/enums/toast-type';
import { later } from '@ember/runloop';

export default class ToastService extends Service {
  @tracked type = ToastType.Default;
  @tracked title: string | undefined;
  @tracked message: string | undefined;
  @tracked isVisible = false;

  @action
  showError(message: string, title = 'Error'): void {
    this.show(title, message, ToastType.Error);
  }

  @action
  show(title: string, message: string, type = ToastType.Default): void {
    this.type = type;
    this.title = title;
    this.message = message;
    this.isVisible = true;

    // prettier-ignore
    later(this, this.resetToast, 5000);
  }

  resetToast(): void {
    this.type = ToastType.Default;
    this.title = undefined;
    this.message = undefined;
    this.isVisible = false;
  }
}
