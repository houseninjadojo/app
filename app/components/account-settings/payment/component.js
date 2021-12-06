import Component from '@glimmer/component';

export default class PaymentComponent extends Component {
  
  paymentFields = [
    {
        required: true,
        label: 'Card Number',
        placeholder: '',
    },
    {
        required: true,
        label: 'CVC',
        placeholder: '',
    },
    {
        required: true,
        label: 'Month',
        placeholder: 'MM',        
    },
    {
      required: true,
      label: 'Year',
      placeholder: 'YYYY',      
    },
    {
        required: true,
        label: 'Zipcode',
        placeholder: '',
    },    
  ]
}
