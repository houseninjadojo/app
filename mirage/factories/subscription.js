import { Factory, trait, association } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  status() {
    return 'active';
  },

  canceledAt() {
    return null;
  },

  trialStart() {
    return null;
  },

  trialEnd() {
    return null;
  },

  currentPeriodStart() {
    return faker.date.recent(15);
  },

  currentPeriodEnd() {
    return faker.date.future(15);
  },

  withPaymentMethod: trait({
    paymentMethod: association(),
  }),

  withSubscriptionPlan: trait({
    subscriptionPlan: association(),
  }),

  withUser: trait({
    user: association(),
  }),
});
