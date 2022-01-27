export default function () {
  this.transition(
    this.fromRoute(['dashboard']),
    this.toRoute('settings'),
    this.use('toRight'),
    this.reverse('toLeft')
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
    this.use('slideOverUp', { duration: 1000, easing: [100, 20] }),
    this.reverse('slideOverDown', { duration: 1000 })
  );
}
