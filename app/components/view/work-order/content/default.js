import Component from '@glimmer/component';
import { isCompletedWorkOrder } from 'houseninja/utils/components/work-order/work-order-status';

export default class WorkOrderDefaultViewContentComponent extends Component {
  get hideCancelRequestButton() {
    return isCompletedWorkOrder(this.args.model.status);
  }
}
