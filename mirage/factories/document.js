import { Factory } from 'miragejs';
import faker from '@faker-js/faker';

export default Factory.extend({
  contentType() {
    return faker.system.mimeType();
  },

  filename() {
    return faker.system.commonFileName();
  },

  // key() {
  //   return '';
  // },

  url() {
    return 'https://s3.amazonaws.com/sandbox.documents.houseninja.co/test.pdf';
  },
});
