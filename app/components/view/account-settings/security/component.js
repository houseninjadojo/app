import Component from '@glimmer/component';

export default class SecurityComponent extends Component {
  securityFields = [
    {
      type: 'password',
      id: 'current-password',
      required: true,
      label: 'Current Password',
      placeholder: '',
    },
    {
      type: 'password',
      id: 'new-password',
      required: true,
      label: 'New Password',
      placeholder: '',
    },
    {
      type: 'password',
      id: 'confirm-password',
      required: true,
      label: 'Confirm Password',
      placeholder: '',
    },
  ];
}
