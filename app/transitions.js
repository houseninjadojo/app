export default function () {
  // settings
  this.transition(
    // this.fromRoute('people.index'),
    this.toRoute('settings.index'),
    this.use('toRight'),
    this.reverse('toLeft')
  );
}
