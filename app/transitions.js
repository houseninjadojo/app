export default function () {
  this.transition(
    this.fromRoute(['dashboard']),
    this.toRoute('settings'),
    this.use('toRight', { duration: 500, easing: [100, 20] }),
    this.reverse('toLeft', { duration: 300 })
  );

  this.transition(
    this.fromRoute(['settings', 'dashboard']),
    this.toRoute('vault'),
    this.use('toLeft', { duration: 500, easing: [100, 20] }),
    this.reverse('toRight', { duration: 300 })
  );

  this.transition(
    this.toRoute([
      'settings.contact',
      'settings.payment',
      'settings.security',
      'settings.property',
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
    this.toRoute(['settings']),
    this.use('toUp', { duration: 500, easing: [100, 20] }),
    this.reverse('toDown', { duration: 300 })
  );
}
