import { Http } from '@capacitor-community/http';
import { run } from '@ember/runloop';

/**
 * GET request
 *
 * @param {String} url
 * @param {Object} [headers={}]
 * @return {RSVP.Promise<Object|String>} - the response body
 */
export async function get(url, headers = {}) {
  try {
    return await run(async () => {
      let response = await Http.get({ url, headers });
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
export async function post(url, headers = {}, data = null) {
  const options = { url, headers, data };
  try {
    let response = await run(async () => {
      return await Http.post(options);
    });
    return response.data;
  } catch (e) {
    console.error(e);
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
export function encodeFormData(data) {
  return Object.keys(data)
    .map((k) => `${k}=${data[k]}`)
    .join('&');
}
