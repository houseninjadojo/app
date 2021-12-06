import Component from '@glimmer/component';

export default class PaymentComponent extends Component {
  
  paymentFields = [
    {
        id:'card-number',
        required: true,
        label: 'Card Number',
        placeholder: '',
    },
    {
        id:'cvc',      
        required: true,
        label: 'CVC',
        placeholder: '',
    },
    {
        id:'card-month',
        required: true,
        label: 'Month',
        placeholder: 'MM',        
    },
    {
      id:'card-year',
      required: true,
      label: 'Year',
      placeholder: 'YYYY',      
    },
    {
        id:'card-zipcode',
        required: true,
        label: 'Zipcode',
        placeholder: '',
    },    
  ]
}
