import Component from '@glimmer/component';
import { debug } from '@ember/debug';

export default class BreadcrumbsComponent extends Component {
  isLastOrOnly(curr) {
    debug(`isLastOrOnly: ${this.args.breadcrumbs.length === curr - 1}`);
    return this.args.breadcrumbs.length === curr - 1;
  }
}
