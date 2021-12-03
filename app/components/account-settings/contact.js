import Component from '@glimmer/component';

export default class ContactComponent extends Component {
  
  contactFields = [
    {
        required: true,
        label: 'First Name',
        placeholder: '(Required)',
    },
    {
        required: true,
        label: 'Last Name',
        placeholder: '(Required)',
    },
    {
        required: true,
        label: 'Phone',
        placeholder: '(Required)',
        description: 'We only use your phone number to contact you.'
    },
    {
        required: true,
        label: 'Email',
        placeholder: '(Required)',
    },    
  ]
}
