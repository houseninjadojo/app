declare module '@ember/utils' {
  // import { TypeOf } from '@ember/utils/-private/types';

  type EmptyType = null | undefined | '' | false | 0 | [];
  type BlankType = null | undefined | '' | [] | '\n\t' | ' ';
  type NoneType = null | undefined;
  type TypeOfType =
    | 'object'
    | 'string'
    | 'number'
    | 'boolean'
    | 'regexp'
    | 'function'
    | 'array'
    | 'error'
    | 'filelist'
    | 'date'
    | 'null'
    | 'symbol'
    | 'bigint'
    | 'undefined';

  export function compare(a: unknown, b: unknown): number;
  export function isBlank<T>(value: T): value is Extract<T, BlankType>;
  export function isEmpty<T>(value: T): value is Extract<T, EmptyType>;
  export function isEqual(a: unknown, b: unknown): boolean;
  export function isNone<T>(value: T): value is Extract<T, NoneType>;
  export function isPresent<T>(value: T): value is Exclude<T, EmptyType>;
  export function typeOf(value: unknown): TypeOfType;
  export function typeOf(): 'undefined';
}
