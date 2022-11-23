import { typeOf } from '@ember/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeJSON(payload: any): string {
  if (typeOf(payload) === 'object') {
    return JSON.stringify(payload);
  }
  return payload;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserializeJSON(payload: any) {
  if (typeOf(payload) === 'string') {
    try {
      return JSON.parse(payload);
    } catch (e) {
      return payload;
    }
  }
  return payload;
}
