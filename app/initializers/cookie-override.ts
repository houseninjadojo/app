// https://github.com/DataDog/browser-sdk/issues/480#issuecomment-859495280

// import { Capacitor } from '@capacitor/core';

// const storage = sessionStorage; // or localStorage
// const cookieDesc =
//   Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
//   Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

// const inject = () => {
//   if (cookieDesc && cookieDesc.configurable) {
//     Object.defineProperty(document, 'cookie', {
//       get: function () {
//         const res: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
//         Object.keys(storage).forEach((key) => {
//           if (key.startsWith('cookie-')) {
//             const item = JSON.parse(storage.getItem(key) ?? '{}');
//             if (item.expiry && new Date(item.expiry) < new Date()) {
//               storage.removeItem(key);
//             } else {
//               res.push(key.replace('cookie-', '') + '=' + item.value);
//             }
//           }
//         });
//         return res.join('; ');
//       },
//       set: function (val) {
//         const regex = new RegExp(
//           '([^=;]*)\\s*=\\s*([^;]*);(.*expires=([^;]+);)?'
//         );
//         const matches = regex.exec(val) ?? [];
//         cookieDesc.set?.call(document, val);
//         storage.setItem(
//           'cookie-' + matches[1],
//           JSON.stringify({ value: matches[2], expiry: matches[4] })
//         );
//       },
//     });
//   }
// };

export function initialize() {
  // if (Capacitor.isNativePlatform()) {
  //   inject();
  // }
}

export default {
  initialize,
};
