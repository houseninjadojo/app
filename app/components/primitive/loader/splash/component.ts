import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import lottieWeb, { AnimationItem, RendererType } from 'lottie-web';
import { splashLoader } from './animation-object/logo-splash';
import { runTask, addEventListener } from 'ember-lifeline';

type Args = {
  toggle(): void;
};

type AnimationTarget = AnimationItem & EventTarget;

export default class SplashLoaderComponent extends Component<Args> {
  @tracked isFinished = false;

  @action
  video(video: HTMLVideoElement): void {
    addEventListener(this, video, 'ended', () => {
      this.isFinished = true;
      runTask(this, this.args.toggle, 100);
    });
  }

  @action
  showLoader(container: HTMLElement): void {
    const defaultOptions = {
      container,
      renderer: 'svg' as RendererType,
      autoplay: true,
    };
    const startOptions = {
      ...defaultOptions,
      loop: false,
      animationData: splashLoader,
    };
    const animation = lottieWeb.loadAnimation(startOptions) as AnimationTarget;
    animation.setSpeed(1);
    addEventListener(this, animation, 'complete', () => {
      runTask(this, this.args.toggle, 100);
    });
  }
}
