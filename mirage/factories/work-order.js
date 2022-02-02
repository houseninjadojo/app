import { Factory } from 'miragejs';

export default Factory.extend({
  scheduledDate() {
    return '11/11/21';
  },

  scheduledTime() {
    return '10:00AM - 2:00PM';
  },

  vendor(i) {
    return `Paulie's Plumbing Services ${i}`;
  },

  description() {
    return 'Lorem ipsum dolor sit amet';
  },

  status() {
    return 'open';
  },

  invoiceUri() {
    return '';
  },
});
