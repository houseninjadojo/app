import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import moment from 'moment';
import { workOrderStatus } from 'houseninja/data/work-order-status';
import { vault } from 'houseninja/data/document-stub';

const DATE_FORMAT = 'MM/DD/YY';
export default class WorkHistoryComponent extends Component {
  tabs = [
    // {
    //   label: 'Open Work Orders',
    //   active: true,
    // },
  ];
  allWorkOrders = this.args.workOrders.map((w) => {
    return {
      id: w.id,
      name: w.description,
      description: w.vendor,
      // scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
      status: w.status,
      ...w,
    };
  });

  pastWorkOrders = this.allWorkOrders
    .filter((w) => {
      const historicalWorkOrder =
        w.status === workOrderStatus.invoicePaidByCustomer ||
        w.status === workOrderStatus.closed;
      console.log(historicalWorkOrder, w.status);
      return historicalWorkOrder;
    })
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) <
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  @action
  openBrowser() {
    const doc = vault.documentStub.filter((d) => d.isWalkthroughReport)[0];
    const uri = (doc && doc.uri) || null;

    if (uri) {
      Browser.open({
        url: uri,
        presentationStyle: 'popover',
      });
    }
  }
}
