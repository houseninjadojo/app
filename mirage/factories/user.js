import { Factory, association } from 'miragejs';
import faker from '@faker-js/faker';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import ENV from 'houseninja/config/environment';
import getPlatform from 'houseninja/utils/get-platform';
import { ALL as ContactTypes } from 'houseninja/data/enums/contact-type';
import { ALL as OnboardingSteps } from 'houseninja/data/enums/onboarding-step';

export default Factory.extend({
  promoCode: association(),
  subscription: association(),

  email() {
    return faker.internet.email();
  },

  firstName() {
    return faker.name.firstName();
  },

  lastName() {
    return faker.name.lastName();
  },

  phoneNumber() {
    return faker.phone.phoneNumberFormat();
  },

  intercomHash() {
    // get the secret corresponding to platform (web, ios, or android)
    let currentPlatform = getPlatform();
    let secret = ENV.intercom.identityVerificationSecrets[currentPlatform];

    // compute the hash
    let hash = hmacSHA256(this.id, secret);
    return hash.toString();
  },

  contactType() {
    return faker.helpers.arrayElement(ContactTypes);
  },

  onboardingStep() {
    return faker.helpers.arrayElement(OnboardingSteps);
  },

  onboardingCode() {
    return faker.random.alphaNumeric(12);
  },

  afterCreate(user, server) {
    let paymentMethods = server.createList('credit-card', 1);
    let properties = server.createList('property', 1);
    user.update({
      properties,
      paymentMethods,
    });
  },
});
