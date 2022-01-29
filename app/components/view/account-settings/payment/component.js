import Component from '@glimmer/component';

export default class PaymentComponent extends Component {
  paymentFields = [
    {
      id: 'card-number',
      required: true,
      label: 'Card Number',
      placeholder: '',
      value: 'number',
    },
    {
      type: 'number',
      id: 'cvc',
      required: true,
      label: 'CVC',
      placeholder: '',
      value: 'cvv',
    },
    {
      type: 'number',
      id: 'card-month',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: 'expMonth',
    },
    {
      type: 'number',
      id: 'card-year',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',
      value: 'expYear',
    },
    {
      // type: 'number',
      id: 'card-zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: 'zipcode',
    },
  ];
}
