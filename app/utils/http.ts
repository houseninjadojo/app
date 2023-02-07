import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { captureException } from 'houseninja/services/telemetry';

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
  let res: HttpRes;
  try {
    const response: HttpResponse = await CapacitorHttp.get({ url, headers });
    res = response.data;
  } catch (e) {
    captureException(e as Error);
    res = Promise.reject(e);
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
  const options = { url, headers, data };
  let res: HttpRes;
  try {
    const response = await CapacitorHttp.post(options);
    res = response.data;
  } catch (e) {
    captureException(e as Error);
    res = Promise.reject(e);
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
