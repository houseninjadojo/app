import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

interface Detail {
  name: string;
}

export default Factory.extend({
  name(): string {
    return faker.random.words();
  },

  details(): Array<Detail> {
    const randomDetails: Array<Detail> = faker.random
      .words(5)
      .split(' ')
      .map((w) => {
        return { name: w };
      });

    return [...randomDetails];
  },
});
