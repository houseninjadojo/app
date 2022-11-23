import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'ember-simple-auth/authenticators/base' {
  export default class Base extends EmberObject.extend(Evented) {
    restore(data: any): Promise<any>;
    authenticate(...args: any[]): Promise<any>;
    invalidate(data: any): Promise<any>;
  }
}
