import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SplashLoaderComponent extends Component {
  @tracked isFinished = false;

  @action
  video(video) {
    const that = this;

    video.addEventListener('ended', () => {
      that.isFinished = true;
      setTimeout(() => {
        that.args.toggle();
      }, 100);
    });
  }
}
