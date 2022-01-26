import { Factory } from 'miragejs';
import faker from 'faker';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import ENV from 'houseninja/config/environment';
import getPlatform from 'houseninja/utils/get-platform';

export default Factory.extend({
  // properties: association(),

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
    return faker.phone.phoneNumber();
  },

  intercomHash() {
    // get the secret corresponding to platform (web, ios, or android)
    let currentPlatform = getPlatform();
    let secret = ENV.intercom.identityVerificationSecrets[currentPlatform];

    // compute the hash
    let hash = hmacSHA256(this.id, secret);
    return hash.toString();
  },

  afterCreate(user, server) {
    user.update({
      properties: server.createList('property', 1),
    });
  },
});
