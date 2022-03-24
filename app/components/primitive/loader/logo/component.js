import Component from '@glimmer/component';
import { action } from '@ember/object';
import lottieWeb from 'lottie-web';
import { logoLoader } from './animation-object/logo-loader';
import { logoLoaderFinished } from './animation-object/logo-loader-checked';

export default class LogoLoaderComponent extends Component {
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
      loop: true,
      animationData: logoLoader,
    };
    const finishedOptions = {
      ...defaultOptions,
      loop: false,
      animationData: logoLoaderFinished,
    };

    lottieWeb
      .loadAnimation(
        selector === 'logo-loader' ? startOptions : finishedOptions
      )
      .setSpeed(1.75);
  }
}
