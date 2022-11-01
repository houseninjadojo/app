import { Factory, association } from 'miragejs';
import { faker } from '@faker-js/faker';
import { HmacSHA256 } from 'crypto-js';
import ENV from 'houseninja/config/environment';
import getPlatform from 'houseninja/utils/get-platform';
import { ALL as ContactTypes } from 'houseninja/data/enums/contact-type';
import { ALL as OnboardingSteps } from 'houseninja/data/enums/onboarding-step';

export default Factory.extend({
  promoCode: association(),
  subscription: association(),

  email(): string {
    return faker.internet.email();
  },

  firstName(): string {
    return faker.name.firstName();
  },

  lastName(): string {
    return faker.name.lastName();
  },

  phoneNumber(): string {
    return faker.phone.number();
  },

  intercomHash(): string {
    // get the secret corresponding to platform (web, ios, or android)
    const currentPlatform = getPlatform();
    const secret = ENV.intercom.identityVerificationSecrets[currentPlatform];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = this.id;
    // compute the hash
    const hash = HmacSHA256(id, secret);
    return hash.toString();
  },

  contactType(): string {
    return faker.helpers.arrayElement(ContactTypes);
  },

  onboardingStep(): string {
    return faker.helpers.arrayElement(OnboardingSteps);
  },

  onboardingCode(): string {
    return faker.random.alphaNumeric(12);
  },

  afterCreate(user, server): void {
    const paymentMethods = server.createList('credit-card', 1);
    const properties = server.createList('property', 1);
    user.update({
      properties,
      paymentMethods,
    });
  },
});
