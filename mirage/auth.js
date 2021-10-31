import { SignJWT, importJWK } from 'jose';

// Dummy JWK Private Key for signing JWTs
const PRIVATE_KEY = {
  kty: 'RSA',
  n: '4coiv3OIXifhKWZwKNs0nzQUObq6kUEzPpE5ugEp1SNwvOPhuPgIJC4iwmsHkev0VtpZVr4ugawKu1kkavdz5PKuOIbW0HVaxuTSwSwW7iB-IoJw6Wpy3jP4o_3fPiRDA_JF-sHuAEFwWzmGu037BEogMj6UyzyiOPV2hiLgK0tGid7PFKwNxyTIZAoSMWIrvztICSieK-ptKOOQW6leAsDqIyQ0TpF9KDKaJZ0jkt08pb9MRAhRUfngap0sap--DDIXOwudkrJt9vp3Pz7e6SgkHyrUKh1sifY_RQpBT2zhXVjE7-2yoCa7Gilh2ynJUQlmGRiPNRoAUrRQikO2IQ',
  e: 'AQAB',
  d: 'IoOloCJm_A2Yi52PE4--kX-Cf_idQEr5LF1Ct74pyNzsBNPI01-GzxEGWzXFKHcrGIO0GGBl94h284CC4p8E5kB6hUWHXMIzqCeeV80HjEsHPPs3i1asTG8hWOAb2gHtBJNqQxSV7xARvsAiaktXTaaPGV8bm52fJpnPDl4SakuD1vebMAX__r8Cv0Fi9-D_qgAr4CqafhrSmIwuHZMbKBoxbhjzG4FFeLs5rOX2LuKn9DpVi6Jgtegh2y70gE33FlOeKkAcOkpeYe4krcSduyRzpbksMLyYzIo8n6LNHvLCblgPcPETcGHsT33Tqgn8rehSiUc1HNSz8qZ0N80ZgQ',
  p: '_bPVrcTqUxLHQtUIl_609Mor4kPyOn5SffU1JiaeHEwtH0FUwv93Gr-qmGw0FcS_IRCG_nab9ty2opEYUwH4LKJ3hSjCWZK5X0iGSTlpwkHYNdSn5O8Wm-w_Rw06W2G5J9qkVrZrBX14Y52S8Rlx63OoFbLCzEBR3xFm6LKekSk',
  q: '49WXAIJ6BjkeQ1Da4pRLM4HrAwVkUZFZJ-WRhZt7-3W85TH9NGBrQ2_SaNtoDiQpe77dl87BB88j3gonLSSEAywF_lJRRwFJVLEZFvmv0N3W_TXKsT0nLZqFAeF0SxPh_kYUAg30Bi3w6vK-8Ie4NMBGKhQ2A3QYtRNyvk-CxDk',
  dp: '1PB_VeWkg-uMAeVK3EB148xY_wXmpv_l_0Czxny9UqUBbm1oVm8TqgjbiCmxod_MSFVV6PjmuVHRnStJjkpl4hjPVp26WnJTUs1NoOImiVy4u53s-bNPd7nX9qv8ojyoqvHR49Iii64fQQU-E003F9ewad3rsIH_9cnmZUOe4dk',
  dq: 'kRlUY-S05gW2elSiMi8Tfag-Ddx_OVuCFmCkPxz45vri5Gzjv1mwtnAe5tzk9iydpsu1wJrSYLDRPPXmYV-iG4sL_h5a2Qe-tgtb2UAHctP1ualqf1pc-zQvhTUapT3ybcgfsfdE9DKJ_ne-lt04uY_Cn8XjaGul2JycNQvaUjE',
  qi: '0kMTarh2j3x0Jb7NDKoyAP9Zr5NUsKoJ7u_MMle2iJBCX8l44QCe50Mh0wpp1vPWtkuc7imGC_F-7LiihTn3GcfXbbK0lC1CUSUyJZe-lBzTlB2nuNGRxMBVjj3B2bGkGYIHwbK-bHAWSPyi0IjuyfpqMEo6j2o39fe78ilV8Ok',
};

/**
 * Generate JSON Web Tokens in Mirage
 * Used with `this.post('/oauth/token')`
 *
 * @param {Object} schema Mirage `schema` object
 * @param {Object} req Mirage `Request` object
 * @returns {Object} OAuth JWT Response Object
 */
export async function tokenAuthHandler(schema, req) {
  let body = JSON.parse(req.requestBody);
  let payload = {
    user: {
      id: 1,
      email: body.username,
    },
  };

  let pk;
  try {
    pk = await importJWK(PRIVATE_KEY, 'PS512');
  } catch (err) {
    console.log(err);
  }

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'PS512' })
    .setIssuedAt()
    .setIssuer('api.houseninja.co')
    .setAudience('houseninja:customer')
    .setExpirationTime('15m')
    .sign(pk);

  return { token: jwt, refresh_token: jwt };
}
