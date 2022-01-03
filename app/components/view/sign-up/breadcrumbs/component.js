import Component from '@glimmer/component';

export default class BreadcrumbsComponent extends Component {
  isLastOrOnly(curr) {
    console.log(this.args.breadcrumbs.length === curr - 1);
    return this.args.breadcrumbs.length === curr - 1;
  }
}
