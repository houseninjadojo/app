import { camelize } from '@ember/string';

// IF YOU NEED TO WRITE A STRING HELPER
// FIRST SEE https://api.emberjs.com/ember/4.3/classes/String

export const toCamel = (s) => {
  return camelize(s);
  // return s.replace(/([-_][a-z])/gi, ($1) => {
  //   return $1.toUpperCase().replace('-', '').replace('_', '');
  // });
};
