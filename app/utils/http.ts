import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { getActiveTransaction } from '@sentry/ember';
import { captureException } from './sentry';

type ResponsePayload = HttpResponse | Record<string, unknown> | undefined;
type HttpRes = Promise<ResponsePayload>;

/**
 * GET request
 *
 * @param {String} url
 * @param {Object} [headers={}]
 * @return {RSVP.Promise<Object|String>} - the response body
 */
// eslint-disable-next-line prettier/prettier
export async function get(url: string, headers = {}): HttpRes {
  const span = httpSpan('get', url);
  let res: HttpRes;
  try {
    const response: HttpResponse = await CapacitorHttp.get({ url, headers });
    res = response.data;
    span?.setStatus('ok');
  } catch (e) {
    span?.setStatus('error');
    captureException(e as Error);
    res = Promise.reject(e);
  } finally {
    span?.finish();
  }
  return res;
}

/**
 * POST Request
 * @method post
 * @param {String} url
 * @param {Object} [headers={}]
 * @param {Object|String} [data=null]
 * @return {RSVP.Promise<Object>}
 */
// eslint-disable-next-line prettier/prettier
export async function post(url: string, headers = {}, data?: unknown): HttpRes {
  const span = httpSpan('post', url);
  const options = { url, headers, data };
  let res: HttpRes;
  try {
    const response = await CapacitorHttp.post(options);
    res = response.data;
    span?.setStatus('ok');
  } catch (e) {
    span?.setStatus('error');
    captureException(e as Error);
    res = Promise.reject(e);
  } finally {
    span?.finish();
  }
  return res;
}

/**
 * @exports Network
 */
export default {
  get,
  post,
};

/**
 * @private
 * @method encodeFormData
 *
 * Encode Object as query string
 *
 * @example
 *   encodeFormData({ a: 'b', c: 'd' })
 *   // => 'a=b&c=d'
 *
 * @param {Object} data
 * @return {String}
 */
export function encodeFormData(data: { [key: string]: string }) {
  return Object.keys(data)
    .map((k) => `${k}=${data[k]}`)
    .join('&');
}

/**
 * @private
 */
function httpSpan(method: string, url: string) {
  const transaction = getActiveTransaction();
  const span = transaction?.startChild({
    op: 'http.client',
    description: `${method.toUpperCase()} ${url}`,
    tags: {
      capacitor: true,
      url,
      method,
    },
  });
  return span;
}
