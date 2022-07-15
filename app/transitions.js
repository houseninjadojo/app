import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default function () {
  this.transition(
    this.fromRoute([NATIVE_MOBILE_ROUTE.DASHBOARD.INDEX]),
    this.toRoute(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX),
    this.use('toRight', { duration: 500, easing: [100, 20] }),
    this.reverse('toLeft', { duration: 300 })
  );

  this.transition(
    this.fromRoute([
      NATIVE_MOBILE_ROUTE.SETTINGS.INDEX,
      NATIVE_MOBILE_ROUTE.DASHBOARD.INDEX,
    ]),
    this.toRoute([
      NATIVE_MOBILE_ROUTE.VAULT.INDEX,
      NATIVE_MOBILE_ROUTE.ONBOARDING.INDEX,
    ]),
    this.use('toLeft', { duration: 500, easing: [100, 20] }),
    this.reverse('toRight', { duration: 300 })
  );

  this.transition(
    this.toRoute([
      NATIVE_MOBILE_ROUTE.SETTINGS.CONTACT,
      NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT,
      NATIVE_MOBILE_ROUTE.SETTINGS.SECURITY,
      NATIVE_MOBILE_ROUTE.SETTINGS.PROPERTY,
      NATIVE_MOBILE_ROUTE.FAQ,
    ]),
    this.use('toUp', { duration: 500, easing: [100, 20] }),
    this.reverse('toDown', { duration: 300 })
  );

  this.transition(
    this.toRoute([NATIVE_MOBILE_ROUTE.CANCEL_SUBSCRIPTION.INDEX]),
    this.use('toLeft', { duration: 500, easing: [100, 20] }),
    this.reverse('toRight', { duration: 300 })
  );

  this.transition(
    this.fromRoute([
      NATIVE_MOBILE_ROUTE.DASHBOARD.INDEX,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HOME,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HANDLE_IT,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HISTORY,
    ]),
    this.toRoute([
      NATIVE_MOBILE_ROUTE.DASHBOARD.INDEX,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HOME,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HANDLE_IT,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HISTORY,
    ]),
    this.use('crossFade', { duration: 150 })
  );

  this.transition(
    this.fromRoute([NATIVE_MOBILE_ROUTE.WORK_ORDERS.INDEX]),
    this.toRoute([NATIVE_MOBILE_ROUTE.SETTINGS.INDEX]),
    this.use('toUp', { duration: 500, easing: [100, 20] }),
    this.reverse('toDown', { duration: 300 })
  );

  this.transition(
    this.fromRoute([
      NATIVE_MOBILE_ROUTE.DASHBOARD.INDEX,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HOME,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HANDLE_IT,
      NATIVE_MOBILE_ROUTE.DASHBOARD.HISTORY,
    ]),
    this.toRoute([NATIVE_MOBILE_ROUTE.WORK_ORDERS.INDEX]),
    this.use('toLeft', { duration: 500, easing: [100, 20] }),
    this.reverse('toRight', { duration: 300 })
  );
}
