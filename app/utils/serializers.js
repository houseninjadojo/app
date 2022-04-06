import { typeOf } from '@ember/utils';

export function serializeJSON(payload) {
  if (typeOf(payload) === 'object') {
    return JSON.stringify(payload);
  }
  return payload;
}

export function deserializeJSON(payload) {
  if (typeOf(payload) === 'string') {
    try {
      return JSON.parse(payload);
    } catch (e) {
      return payload;
    }
  }
  return payload;
}
