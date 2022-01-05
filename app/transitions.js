export default function () {
  this.transition(
    this.fromRoute(['home', 'handle-it', 'work-history']),
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
    ]),
    this.use('toUp'),
    this.reverse('toDown')
  );
}
