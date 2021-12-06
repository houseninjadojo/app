import Component from '@glimmer/component';

export default class PropertyComponent extends Component {  
  addressFields = [
    {      
        id: 'street1',    
        required: true,
        label: 'Street Address 1',
        placeholder: '',
        value: '',
    },
    {
        id: 'street2',
        required: false,
        label: 'Street Address 2',
        placeholder: '(Optional)',
        value: '',
    },
    {
        id: 'city',
        required: true,
        label: 'City',
        placeholder: '',
        value: 'Austin',
        disabled: true,
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options:[
        { value: 'TX',
          label: 'TX',
          selected: true,
        },
      ],
      disabled: true,    
    },
    {
        id: 'zipcode',
        required: true,
        label: 'Zipcode',
        placeholder: '',
        value: '',
    },    
  ]
}
