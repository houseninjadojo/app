import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  contentType() {
    return faker.system.mimeType();
  },

  filename() {
    return faker.system.commonFileName();
  },

  url() {
    return 'https://static1.squarespace.com/static/6007837f3d27c928fce6aaef/t/614b66d8f283c85ae94b663f/1632331480205/NEW_Home-walkthrough_checklist.pdf';
  },

  name() {
    return faker.lorem.sentence(1);
  },
});
