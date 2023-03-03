import Component from '@glimmer/component';
import type CreditCard from 'houseninja/models/credit-card';
import type { Field } from 'houseninja/app/components';

type Args = {
  creditCard: CreditCard;
};

export default class CreditCardFormComponent extends Component<Args> {
  fields: Field[] = [
    {
      id: 'cardNumber',
      required: true,
      label: 'Card Number',
      inputmode: 'numeric',
      placeholder: '',
    },
    {
      id: 'cvv',
      required: true,
      label: 'Security Code',
      inputmode: 'numeric',
      placeholder: '',
    },
    {
      id: 'expMonth',
      required: true,
      label: 'Month',
      inputmode: 'numeric',
      placeholder: 'MM',
    },
    {
      id: 'expYear',
      required: true,
      label: 'Year',
      inputmode: 'numeric',
      placeholder: 'YY',
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      inputmode: 'numeric',
      placeholder: '',
    },
  ];
}
