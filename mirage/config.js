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

const INVOICE_ACCESS_TOKEN =
  'BAh7CEkiCGdpZAY6BkVUSSJDZ2lkOi8vaG91c2UtbmluamEvSW52b2ljZS9kOGZiY2UwNS1lNDJkLTRiOGQtODVlYi1hNzJmNGIyMTY5NzEGOwBUSSIMcHVycG9zZQY7AFRJIgxkZWZhdWx0BjsAVEkiD2V4cGlyZXNfYXQGOwBUSSIdMjAyMi0wNi0xM1QwMTo1Mjo0NS4wMTBaBjsAVA==--b68ed54fd83f0c4b3a946cd121918498ab8f15c8';
// 'eZAGjnH91fpQJ6jg0/pmwt2VegG1DuLsSmloZgcb3tlmTlkuN86Qu4hLaKuMXKtBHckIX+kmcKF/45iKwB1zIUPsfqkJFi1DJvHDvfEBSs0aOnVn5LMBHtFYspfAqQJrmTfHRreTvjKw/Do9jvxj0D2M5a/jq6KP1OToOKZ2fsROJM42TuR2RndRMFgbfAlzTfagFYrsTgX3QbDuashYkAEVb8lAmE9jP/QchPJ5IDacf77aIFxmd0bmmzKtulUyiptKGDwEfFNrmGs9eTtS8eqgxe1COTM=--rTmMzbCLQ8A80GDG--fxrcgmX7B3incGIFfgMLPg==';

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
  this.get('/invoices/:id', (schema, request) => {
    request.queryParams = request.queryParams || {};
    const invoiceId = request.params.id;
    if (invoiceId === INVOICE_ACCESS_TOKEN) {
      if (!request.queryParams.include) {
        request.queryParams.include = [
          'work_order',
          'work_order.property',
          'work_order.property.user',
          'work_order.property.user.credit_cards',
        ];
      }
      return schema.invoices.create();
    }
  });

  this.resource('credit-card', { path: '/payment-methods' });
  this.resource('line-item', { path: '/line-items' });
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
  this.resource('document-group', { path: '/document-groups' });
  this.resource('document', { path: '/documents' });

  this.get('/documents', (schema, request) => {
    const tags = request.queryParams['filter[tags]'];
    if (tags) {
      return schema.documents.where({ tags });
    } else {
      return schema.documents.all();
    }
  });

  // resource verification
  this.post('/resource-verification', (schema, request) => {
    const data = JSON.parse(request.requestBody)?.data || {};
    const { resourceName, recordId, attribute, value } = data;
    const resource = schema[resourceName].find(recordId);
    const result = resource.attrs[attribute] === value;
    if (result === true) {
      return schema.resourceVerifications.create({
        resourceName,
        recordId,
        attribute,
        value,
        result,
      });
    } else {
      return new Response(
        422,
        {},
        { errors: ['resource verification failed'] }
      );
    }
  });

  // Auth
  this.passthrough(`https://${ENV.auth.domain}/authorize`);
  this.passthrough(`https://${ENV.auth.domain}/oauth/token`);
  this.passthrough(`https://${ENV.auth.domain}/userinfo`);

  // Uploads
  this.passthrough(
    'https://sandbox.api.houseninja.co/rails/active_storage/direct_uploads'
  );
  this.passthrough(
    'https://api.houseninja.co/rails/active_storage/direct_uploads'
  );

  // Filesystem
  this.passthrough(`co.houseninja.application://localhost`);
  this.passthrough(`file:///`);
  this.passthrough((request) => {
    if (request.url.startsWith('co.houseninja.application://')) {
      return true;
    } else {
      return false;
    }
  });
}
