import Component from '@glimmer/component';

export default class ContactComponent extends Component {
  contactFields = [
    {
      id: 'firstName',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: 'firstName',
    },
    {
      id: 'lastName',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: 'lastName',
    },
    {
      type: 'tel',
      id: 'phoneNumber',
      required: true,
      label: 'Phone',
      placeholder: '',
      description: 'We only use your phone number to contact you.',
      value: 'phoneNumber',
    },
    {
      type: 'email',
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
      value: 'email',
    },
  ];  
}
