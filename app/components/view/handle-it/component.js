import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YY';

export default class HandleItComponent extends Component {
  @service router;

  tabs = [
    {
      label: 'Open Work Orders',
      active: true,
      query: {
        status: 'open',
      },
    },
  ];

  allWorkOrders = this.args.workOrders.map((w) => {
    return {
      id: w.id,
      name: w.description,
      description: w.vendor,
      scheduledTime: w.scheduledTime,
      scheduledDate: w.scheduledDate,
      ...w,
    };
  });

  currentWorkOrders = this.allWorkOrders
    .filter((w) => {
      const today = moment().format(DATE_FORMAT);
      const scheduleDateInMoment = moment(w.scheduledDate).format(DATE_FORMAT);
      const differenceInDays = moment(today).diff(scheduleDateInMoment, 'days');

      return differenceInDays <= 0;
    })
    .sort((a, b) => {
      return (
        moment(a.scheduledDate, DATE_FORMAT) >
        moment(b.scheduledDate, DATE_FORMAT)
      );
    });

  @action
  selectRoute(routeName) {
    this.router.transitionTo(routeName);
  }
}
