import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import lottieWeb from 'lottie-web';
import { splashLoader } from './animation-object/logo-splash';

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

  @action
  showLoader(selector) {
    const container = document.getElementById(selector);
    const defaultOptions = {
      container,
      renderer: 'svg',
      autoplay: true,
    };
    const startOptions = {
      ...defaultOptions,
      loop: false,
      animationData: splashLoader,
    };

    const animation = lottieWeb.loadAnimation(startOptions);
    animation.setSpeed(1);

    const that = this;

    animation.addEventListener('complete', function () {
      setTimeout(() => {
        that.args.toggle();
      }, 100);
    });
  }
}
