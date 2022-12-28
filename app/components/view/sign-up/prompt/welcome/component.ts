import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { SIGNUP_ROUTE } from 'houseninja/data/enums/routes';

import confetti from 'canvas-confetti';
import RouterService from '@ember/routing/router-service';

export default class WelcomeComponent extends Component {
  @service declare router: RouterService;

  interval?: ReturnType<typeof setTimeout>;

  @action
  nextStep() {
    this.router.transitionTo(SIGNUP_ROUTE.PROPERTY_INFO);
  }

  @action
  throwConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    this.interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(this.interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#008581'],
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#008581'],
        })
      );
    }, 250);
  }

  willDestroy() {
    super.willDestroy();
    clearInterval(this.interval);
  }
}
