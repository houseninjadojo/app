import Component from '@glimmer/component';

export default class SecurityComponent extends Component {
  securityFields = [
    {
      type: 'password',
      id: 'currentPassword',
      required: true,
      label: 'Current Password',
      placeholder: '',
    },
    {
      type: 'password',
      id: 'newPassword',
      required: true,
      label: 'New Password',
      placeholder: '',
    },
    {
      type: 'password',
      id: 'confirmPassword',
      required: true,
      label: 'Confirm Password',
    },
  ];
}
