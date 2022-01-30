import { Factory } from 'miragejs';

export default Factory.extend({
  scheduledDate() {
    return '11/11/21';
  },

  scheduledTime() {
    return '10:00AM - 2:00PM';
  },

  vendor() {
    return "Paulie's Plumbing Services";
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
