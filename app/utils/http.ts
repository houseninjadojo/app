import { CapacitorHttp } from '@capacitor/core';
import { run } from '@ember/runloop';

/**
 * GET request
 *
 * @param {String} url
 * @param {Object} [headers={}]
 * @return {RSVP.Promise<Object|String>} - the response body
 */
export async function get(url: string, headers = {}) {
  try {
    return await run(async () => {
      const response = await CapacitorHttp.get({ url, headers });
      return response.data;
    });
  } catch (e) {
    console.error(e);
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
export async function post(url: string, headers = {}, data = null) {
  const options = { url, headers, data };
  const response = await run(async () => {
    return await CapacitorHttp.post(options);
  });
  if (response.status === 403) {
    throw new Error(response.data);
  }
  return response.data;
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
