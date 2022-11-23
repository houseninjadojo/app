import { default as Base } from '@ember-data/adapter/error';

declare module '@ember-data/adapter/error' {
  export class AdapterError extends Base {}

  export type ValidationError = {
    attribute: string;
    message: string;
  };
}
