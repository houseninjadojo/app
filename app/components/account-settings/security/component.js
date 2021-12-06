import Component from '@glimmer/component';

export default class SecurityComponent extends Component {
  
  securityFields = [
    {
        required: true,
        label: 'Current Password',
        placeholder: '',
    },
    {
        required: true,
        label: 'New Password',
        placeholder: '',
    },
    {
        required: true,
        label: 'Confirm Password',
        placeholder: '',
    },        
  ]  
}
