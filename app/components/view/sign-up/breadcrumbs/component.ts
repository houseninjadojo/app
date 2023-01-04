import Component from '@glimmer/component';
import { debug } from '@ember/debug';

type Args = {
  breadcrumbs: Array<{ label: string; route: string }>;
};

export default class BreadcrumbsComponent extends Component<Args> {
  isLastOrOnly(curr: number): boolean {
    debug(`isLastOrOnly: ${this.args.breadcrumbs.length === curr - 1}`);
    return this.args.breadcrumbs.length === curr - 1;
  }
}
