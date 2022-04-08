import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';

export default function () {
  this.transition(
    this.fromRoute(['dashboard']),
    this.toRoute(NATIVE_MOBILE_ROUTE.SETTINGS.INDEX),
    this.use('toRight', { duration: 500, easing: [100, 20] }),
    this.reverse('toLeft', { duration: 300 })
  );

  this.transition(
    this.fromRoute([NATIVE_MOBILE_ROUTE.SETTINGS.INDEX, 'dashboard']),
    this.toRoute('vault'),
    this.use('toLeft', { duration: 500, easing: [100, 20] }),
    this.reverse('toRight', { duration: 300 })
  );

  this.transition(
    this.toRoute([
      NATIVE_MOBILE_ROUTE.SETTINGS.CONTACT,
      NATIVE_MOBILE_ROUTE.SETTINGS.PAYMENT,
      NATIVE_MOBILE_ROUTE.SETTINGS.SECURITY,
      NATIVE_MOBILE_ROUTE.SETTINGS.PROPERTY,
      'contact-us',
      'faq',
    ]),
    this.use('toUp', { duration: 500, easing: [100, 20] }),
    this.reverse('toDown', { duration: 300 })
  );

  this.transition(
    this.fromRoute([
      'dashboard.handle-it',
      'dashboard.home',
      'dashboard.index',
      'dashboard.work-history',
    ]),
    this.toRoute([
      'dashboard.handle-it',
      'dashboard.home',
      'dashboard.index',
      'dashboard.work-history',
    ]),
    this.use('crossFade', { duration: 150 })
  );

  this.transition(
    this.fromRoute(['work-order']),
    this.toRoute([NATIVE_MOBILE_ROUTE.SETTINGS.INDEX]),
    this.use('toUp', { duration: 500, easing: [100, 20] }),
    this.reverse('toDown', { duration: 300 })
  );
}
