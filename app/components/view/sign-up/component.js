import Component from '@glimmer/component';
import breadcrumbs from 'houseninja/utils/signup/breadcrumbs';

export default class SignUpComponent extends Component {
  breadcrumbs = breadcrumbs;

  addressFields = [
    {
      id: 'street1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
    },
    {
      id: 'street2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      disabled: true,
      value: 'Austin',
    },
    {
      isSelect: true,
      id: 'state',
      required: true,
      label: 'State',
      placeholder: '',
      options: [{ value: 'TX', label: 'TX', selected: true }],
      disabled: true,
    },
    {
      type: 'number',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
    },
  ];
}
