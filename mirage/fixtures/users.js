// export default [
//   {
//     id: '01ce0d37-cf98-4f3d-9810-2f5781085d5f',
//     email: 'miles@houseninja.co',
//     firstName: 'Miles',
//     lastName: 'Zimmerman',
//   },
//   {
//     id: '22d8949b-11da-4d13-b4f2-574bede56e0f',
//     email: 'achilles@houseninja.co',
//     firstName: 'Achilles',
//     lastName: 'Imperial',
//   },
//   {
//     id: '61f1f8d79f08390069a537c3',
//     email: 'achilles.imperial@gmail.com',
//     firstName: 'Ottomanelli',
//     lastName: 'Imperial',
//   },
// ];

import { SET_PASSWORD } from 'houseninja/data/enums/onboarding-step';
import { CUSTOMER } from 'houseninja/data/enums/contact-type';

export default [
  {
    id: '01ce0d37-cf98-4f3d-9810-2f5781085d5f',
    email: 'miles@houseninja.co',
    firstName: 'Miles',
    lastName: 'Zimmerman',
    phoneNumber: '925-451-4431',
    contactType: CUSTOMER,
    onboardingStep: SET_PASSWORD,
    onboardingCode: 'asdf1234',
  },
];
