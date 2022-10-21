import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { captureException, startSpan } from './sentry';

type HttpRes = Promise<HttpResponse | void>;

/**
 * GET request
 *
 * @param {String} url
 * @param {Object} [headers={}]
 * @return {RSVP.Promise<Object|String>} - the response body
 */
export async function get(url: string, headers = {}): HttpRes {
  const span = httpSpan('get', url, headers);
  try {
    const response: HttpResponse = await CapacitorHttp.get({ url, headers });
    span?.setStatus(response.status.toString());
    span?.finish();
    return response.data;
  } catch (e) {
    span?.setStatus('error');
    span?.finish();
    captureException(e as Error);
    return;
  }
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
  const span = httpSpan('post', url, headers, data);
  const options = { url, headers, data };
  try {
    const response: HttpResponse = await CapacitorHttp.post(options);
    span?.setStatus(response.status.toString());
    span?.finish();
    return response.data;
  } catch (e) {
    span?.setStatus('error');
    span?.finish();
    captureException(e as Error);
    return;
  }
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
function httpSpan(method: string, url: string, headers = {}, data?: unknown) {
  const span = startSpan('http.client', {
    description: `${method.toUpperCase()} ${url}`,
    tags: {
      capacitor: true,
      url,
      method,
      headers,
      data,
    },
  });
  return span;
}
