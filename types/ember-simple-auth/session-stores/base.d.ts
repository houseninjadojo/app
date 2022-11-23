import EmberObject from '@ember/object';

declare module 'ember-simple-auth/session-stores/base' {
  export default class Base extends EmberObject {
    persist(data: any): Promise<any>;
    restore(): Promise<any>;
    clear(): Promise<any>;
  }
}
