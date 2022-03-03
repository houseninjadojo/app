import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { vault } from 'houseninja/utils/dataStubs';

import moment from 'moment';

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
      ...w,
    };
  });

  pastWorkOrders = this.allWorkOrders
    .filter((w) => {
      const today = moment().format(DATE_FORMAT);
      const scheduleDateInMoment = moment(w.scheduledDate).format(DATE_FORMAT);
      const differenceInDays = moment(today).diff(scheduleDateInMoment, 'days');

      return parseInt(differenceInDays) > 0;
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
