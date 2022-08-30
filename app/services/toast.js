import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TOAST_TYPE } from 'houseninja/data/enums/toast-type';

export default class ToastService extends Service {
  @tracked type = TOAST_TYPE.DEFAULT;
  @tracked title = null;
  @tracked message = null;
  @tracked isVisible = false;

  @action
  show(title, message, type = TOAST_TYPE.DEFAULT) {
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
