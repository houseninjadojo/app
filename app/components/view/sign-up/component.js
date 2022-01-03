import Component from '@glimmer/component';

export default class SignUpComponent extends Component {
  breadcrumbs = {
    serviceArea: ['Service Area'],
    signUp: ['My Plan', 'Tell Us About Yourself', 'Payment'],
    password: ['Set Password'],
    walkthrough: ['Schedule Walkthrough', 'Home Address', 'Scheduling'],
  };
  securityFields = [
    {
      id: 'current-password',
      required: true,
      label: 'Current Password',
      placeholder: '',
    },
    {
      id: 'new-password',
      required: true,
      label: 'New Password',
      placeholder: '',
    },
    {
      id: 'confirm-password',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
    },
  ];

  addressFields = [
    {
      id: 'street1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      // value: this.args.property.line1,
    },
    {
      id: 'street2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      // value: this.args.property.line2,
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      // value: this.args.property.city,
      disabled: true,
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
    },
    {
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      // value: this.args.property.postalCode,
    },
  ];

  paymentFields = [
    {
      id: 'card-number',
      required: true,
      label: 'Card Number',
      placeholder: '',
    },
    {
      id: 'cvc',
      required: true,
      label: 'CVC',
      placeholder: '',
    },
    {
      id: 'card-month',
      required: true,
      label: 'Month',
      placeholder: 'MM',
    },
    {
      id: 'card-year',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',
    },
    {
      id: 'card-zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
    },
  ];

  contactFields = [
    {
      id: 'first-name',
      required: true,
      label: 'First Name',
      placeholder: '',
    },
    {
      id: 'last-name',
      required: true,
      label: 'Last Name',
      placeholder: '',
    },
    {
      id: 'phone',
      required: true,
      label: 'Phone',
      placeholder: '',
      description: 'We only use your phone number to contact you.',
    },
    {
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
    },
  ];
}
