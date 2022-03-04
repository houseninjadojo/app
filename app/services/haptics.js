import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HapticsService extends Service {
  @tracked provideHapticFeedback = true;

  @action
  toggleHaptics() {
    this.provideHapticFeedback = !this.provideHapticFeedback;
  }
}
