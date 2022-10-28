import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ToastType } from 'houseninja/data/enums/toast-type';
import Sentry, { addBreadcrumb } from 'houseninja/utils/sentry';
import { SeverityLevel } from '@sentry/types';
import { later } from '@ember/runloop';

const addToastBreadcrumb = (
  message: string,
  title: string,
  type: ToastType
) => {
  Sentry.addBreadcrumb({
    category: 'toast',
    message: `${title}: ${message}`,
    data: { message, title, type },
    type: 'ui',
    level: (type === ToastType.Default ? 'info' : type) as SeverityLevel,
  });
};

export default class ToastService extends Service {
  @tracked type = ToastType.Default;
  @tracked title: string | undefined;
  @tracked message: string | undefined;
  @tracked isVisible = false;

  @action
  showError(message: string, title = 'Error') {
    addToastBreadcrumb(message, title, ToastType.Error);
    this.show(title, message, ToastType.Error);
  }

  @action
  show(title: string, message: string, type = ToastType.Default) {
    addToastBreadcrumb(message, title, type);
    this.type = type;
    this.title = title;
    this.message = message;
    this.isVisible = true;

    // prettier-ignore
    later(this, this.resetToast, 5000);
  }

  resetToast() {
    this.type = ToastType.Default;
    this.title = undefined;
    this.message = undefined;
    this.isVisible = false;
  }
}
