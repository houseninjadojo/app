import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { impact, ImpactStyle } from 'houseninja/utils/native/haptics';
import isNativePlatform from 'houseninja/utils/is-native-platform';

export default class HapticsService extends Service {
  @tracked provideHapticFeedback = true;

  @action
  toggleHaptics(): void {
    this.provideHapticFeedback = !this.provideHapticFeedback;
  }

  @action
  async giveFeedback(turnOffHapticFeedback = false): Promise<void> {
    if (this.provideHapticFeedback && turnOffHapticFeedback !== true) {
      isNativePlatform() && (await impact(ImpactStyle.Light));
    }
  }
}
