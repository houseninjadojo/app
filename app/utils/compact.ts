/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPresent } from '@ember/utils';

export default function compact<T extends { [key: string]: any }>(
  obj: T
): Record<string, any> {
  return Object.keys(obj).reduce((acc: any, key: keyof typeof obj) => {
    const value = obj[key];
    if (isPresent(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
