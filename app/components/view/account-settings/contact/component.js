import Component from '@glimmer/component';

export default class ContactComponent extends Component {
  contactFields = [
    {
      id: 'first-name',
      required: true,
      label: 'First Name',
      placeholder: '',
      value: 'firstName',
    },
    {
      id: 'last-name',
      required: true,
      label: 'Last Name',
      placeholder: '',
      value: 'lastName',
    },
    {
      type: 'tel',
      id: 'phone',
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
