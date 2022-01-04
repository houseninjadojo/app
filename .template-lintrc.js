'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': { allow: ['liquid-outlet'] },
    'no-implicit-this': { allow: ['liquid-outlet'] },
  },
};
