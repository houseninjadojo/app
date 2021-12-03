import Component from '@glimmer/component';

export default class ContactComponent extends Component {
  
  contactFields = [
    {
        required: true,
        label: 'First Name',
        placeholder: '',
    },
    {
        required: true,
        label: 'Last Name',
        placeholder: '',
    },
    {
        required: true,
        label: 'Phone',
        placeholder: '',
        description: 'We only use your phone number to contact you.'
    },
    {
        required: true,
        label: 'Email',
        placeholder: '',
    },    
  ]
}
