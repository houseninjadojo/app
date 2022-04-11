import ENV from 'houseninja/config/environment';
import {
  discoverEmberDataModels,
  applyEmberDataSerializers,
} from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    models: { ...discoverEmberDataModels(), ...config.models },
    serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  this.urlPrefix = 'https://api.dev.houseninja.co'; // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */

  this.get('/common-requests');
  this.resource('device', { path: '/devices' });
  this.get('/home-care-tips');
  this.resource('invoice', { path: '/invoices' });
  this.resource('credit-card', { path: '/payment-methods' });
  this.resource('payment', { path: '/payments' });
  this.resource('promo-code', { path: '/promo-codes' });
  this.get('/promo-codes', (schema, request) => {
    let code = request.queryParams['filter[code]'];
    return schema.promoCodes.where({ code });
  });
  this.resource('property', { path: '/properties' });
  this.get('/service-areas');
  this.get('/subscription-plans');
  this.resource('subscription', { path: '/subscriptions' });
  this.resource('user', { path: '/users' });

  // we need to replicate looking up a user by their onboarding code
  // uncomment this when you need this behavior
  //
  // this.get('/users', (schema, request) => {
  //   let onboardingCode = request.queryParams['filter[onboardingCode]'];
  //   if (onboardingCode) {
  //     const users = schema.users.where({ onboardingCode });
  //     const user = users.models?.firstObject;
  //     // schema.properties.create({ user: user });
  //     const paymentMethod = schema.creditCards.create({ user: user });
  //     schema.subscriptions.create({
  //       user: user,
  //       paymentMethod: paymentMethod,
  //     });
  //     return users;
  //   } else {
  //     return schema.users.all();
  //   }
  // });

  // we need to replicate the signup restore or create logic of our backend
  // uncomment when you need this behavior
  //
  // this.post('/users', (schema, request) => {
  //   const attributes = JSON.parse(request.requestBody)?.data?.attributes;
  //   const users = schema.users.where({ email: attributes.email });
  //   let user = users.models?.firstObject;
  //   if (user?.onboardingStep) {
  //     schema.properties.create({ user: user });
  //     const paymentMethod = schema.creditCards.create({ user: user });
  //     schema.subscriptions.create({
  //       user: user,
  //       paymentMethod: paymentMethod,
  //     });
  //   } else {
  //     user = schema.users.create(request.requestBody);
  //   }
  //   return user;
  // });
  // this.resource('user', { path: '/users', except: ['index', 'create'] });

  this.resource('work-order', { path: '/work-orders' });
  this.resource('document-groups', { path: '/document-groups' });
  this.resource('documents', { path: '/documents' });

  this.get('/documents', (schema, request) => {
    const tags = request.queryParams['filter[tags]'];
    if (tags) {
      return schema.documents.where({ tags });
    } else {
      return schema.documents.all();
    }
  });

  // Auth
  this.passthrough(`https://${ENV.auth.domain}/authorize`);
  this.passthrough(`https://${ENV.auth.domain}/oauth/token`);
  this.passthrough(`https://${ENV.auth.domain}/userinfo`);
}
