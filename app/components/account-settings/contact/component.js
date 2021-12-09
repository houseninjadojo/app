import Component from '@glimmer/component';

export default class ContactComponent extends Component {
  contactFields = [
    {
      id: 'first-name',
      required: true,
      label: 'First Name',
      placeholder: '',
    },
    {
      id: 'last-name',
      required: true,
      label: 'Last Name',
      placeholder: '',
    },
    {
      id: 'phone',
      required: true,
      label: 'Phone',
      placeholder: '',
      description: 'We only use your phone number to contact you.',
    },
    {
      id: 'email',
      required: true,
      label: 'Email',
      placeholder: '',
    },
  ];
}
