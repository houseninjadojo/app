import { Factory } from 'miragejs';

export default Factory.extend({
  amount() {
    return '29.00';
  },

  description() {
    return 'Subscription update';
  },

  statementDescriptor() {
    return 'HOUSE NINJA, INC.';
  },

  status() {
    return 'succeeded';
  },

  refunded() {
    return false;
  },

  paid() {
    return false;
  },
});
