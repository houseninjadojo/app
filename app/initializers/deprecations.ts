import { registerDeprecationHandler } from '@ember/debug';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    if (options?.id === 'ember-data:deprecate-promise-many-array-behaviors') {
      return;
    } else {
      next(message, options);
    }
  });
}

export default {
  initialize,
};
