export default function () {
  this.transition(
    this.fromRoute(['dashboard']),
    this.toRoute('settings'),
    this.use('toRight', { duration: 500, easing: [100, 20] }),
    this.reverse('toLeft', { duration: 300 })
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
    this.use('slideOverUp', { duration: 500, easing: [100, 20] }),
    this.reverse('slideOverDown', { duration: 300 })
  );
}
