import ENV from 'houseninja/config/environment';

export default function () {
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

  this.resource('address', { path: '/addresses' });
  this.resource('credit-card', { path: '/payment-methods' });
  this.resource('property', { path: '/properties' });
  this.get('/service-areas');
  this.get('/subscription-plans');
  this.resource('user', { path: '/users' });

  // Auth
  this.passthrough(`https://${ENV.auth.domain}/authorize`);
  this.passthrough(`https://${ENV.auth.domain}/oauth/token`);
  this.passthrough(`https://${ENV.auth.domain}/userinfo`);
}
