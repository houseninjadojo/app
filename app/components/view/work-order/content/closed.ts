import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

import type BrowserService from 'houseninja/services/browser';
import type WorkOrderModel from 'houseninja/models/work-order';

type Args = {
  model: WorkOrderModel;
};

export default class WorkOrderClosedViewContentComponent extends Component<Args> {
  @service declare browser: BrowserService;

  get imageUrl(): string | undefined {
    return this.args.model.invoice?.receipt?.url;
  }

  @action
  async openBrowser() {
    if (this.imageUrl) {
      await this.browser.open({
        url: this.imageUrl,
        presentationStyle: 'popover',
      });
    }
  }
}
