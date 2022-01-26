import { Factory } from 'miragejs';
import faker from 'faker';
import jose from 'jose';
import ENV from 'houseninja/config/environment';

const strToBuffer = (str) => {
  let arrayBuffer = new ArrayBuffer(str.length * 1);
  let newUint = new Uint8Array(arrayBuffer);
  newUint.forEach((_, i) => {
    newUint[i] = str.charCodeAt(i);
  });
  return newUint;
};

const signJwt = async (userId) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: ENV.smooch.apiKeyId,
  };
  const payload = {
    scope: 'appUser',
    userId,
  };
  const secret = strToBuffer(ENV.smooch.apiSecret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader(header)
    .sign(secret);
};

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

  afterCreate(user, server) {
    signJwt(user.email).then((jwt) => {
      user.update({
        smoochJWT: jwt,
        properties: server.createList('property', 1),
      });
    });
  },
});
