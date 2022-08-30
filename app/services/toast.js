import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TOAST_TYPE } from 'houseninja/data/enums/toast-type';

export default class ToastService extends Service {
  @tracked type = TOAST_TYPE.DEFAULT;
  @tracked message = null;
  @tracked isVisible = false;

  @action
  show (message, type = TOAST_TYPE.DEFAULT) {
    this.message = message;
    this.isVisible = true
    this.type = type;

    const that = this;
    setTimeout(()=>{
        that.isVisible = false;
        that.type = TOAST_TYPE.DEFAULT;
        that.message = "";
    },5000);
  }

  @action
  async giveFeedback(turnOffHapticFeedback = false) {
    if (this.provideHapticFeedback && turnOffHapticFeedback !== true) {
      isNativePlatform() &&
        (await Haptics.impact({ style: ImpactStyle.Light }));
    }
  }
}
