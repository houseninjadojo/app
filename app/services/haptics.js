import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import isNativePlatform from 'houseninja/utils/is-native-platform';
export default class HapticsService extends Service {
  @tracked provideHapticFeedback = true;

  @action
  toggleHaptics() {
    this.provideHapticFeedback = !this.provideHapticFeedback;
  }

  @action
  async giveFeedback(turnOffHapticFeedback = false) {
    if (this.provideHapticFeedback && turnOffHapticFeedback !== true) {
      isNativePlatform() &&
        (await Haptics.impact({ style: ImpactStyle.Light }));
    }
  }
}
