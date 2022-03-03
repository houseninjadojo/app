import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Browser } from '@capacitor/browser';
import { vault } from 'houseninja/utils/dataStubs';
import moment from 'moment';

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

  pastWorkOrders = this.allWorkOrders.filter((w) => {
    const today = moment().format('MM/DD/YY');
    const scheduleDateInMoment = moment(w.scheduledDate).format('MM/DD/YY');
    const differenceInDays = moment(today).diff(scheduleDateInMoment, 'days');

    return differenceInDays > 0;
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
