import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TOAST_TYPE } from 'houseninja/data/enums/toast-type';
import Sentry from 'houseninja/utils/sentry';

export default class ToastService extends Service {
  @tracked type = TOAST_TYPE.DEFAULT;
  @tracked title = null;
  @tracked message = null;
  @tracked isVisible = false;

  @action
  showError(message, title = 'Error') {
    Sentry.addBreadcrumb({
      category: 'toast',
      message: 'showing error',
      data: {
        message,
        title,
      },
      level: 'info',
    });
    this.show(title, message, TOAST_TYPE.ERROR);
  }

  @action
  show(title, message, type = TOAST_TYPE.DEFAULT) {
    Sentry.addBreadcrumb({
      category: 'toast',
      message: 'showing toast',
      data: {
        message,
        title,
        type,
      },
      level: 'info',
    });
    this.type = type;
    this.title = title;
    this.message = message;
    this.isVisible = true;

    const that = this;
    setTimeout(() => {
      that.type = TOAST_TYPE.DEFAULT;
      that.title = null;
      that.message = null;
      that.isVisible = false;
    }, 5000);
  }
}
