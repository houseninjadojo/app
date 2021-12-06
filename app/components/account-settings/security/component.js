import Component from '@glimmer/component';

export default class SecurityComponent extends Component {
  
  securityFields = [
    {
        id:'current-password',
        required: true,
        label: 'Current Password',
        placeholder: '',
    },
    {
        id:'new-password',
        required: true,
        label: 'New Password',
        placeholder: '',
    },
    {
        id:'confirm-password',
        required: true,
        label: 'Confirm Password',
        placeholder: '',
    },        
  ]  
}
