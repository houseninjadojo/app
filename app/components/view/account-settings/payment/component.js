import Component from '@glimmer/component';

export default class PaymentComponent extends Component {
  paymentFields = [
    {
      id: 'number',
      required: true,
      label: 'Card Number',
      placeholder: '',
      value: 'number',
    },
    {
      id: 'cvv',
      required: true,
      label: 'CVC',
      placeholder: '',
      value: 'cvv',
    },
    {
      type: 'number',
      id: 'expMonth',
      required: true,
      label: 'Month',
      placeholder: 'MM',
      value: 'expMonth',
    },
    {
      type: 'number',
      id: 'expYear',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',
      value: 'expYear',
    },
    {
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: 'zipcode',
    },
  ];
}
