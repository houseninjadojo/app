import Component from '@glimmer/component';

export default class PropertyComponent extends Component {
  addressFields = [
    {
      id: 'street1',
      required: true,
      label: 'Street Address 1',
      placeholder: '',
      value: 'street1',
    },
    {
      id: 'street2',
      required: false,
      label: 'Street Address 2',
      placeholder: '(Optional)',
      value: 'street2',
    },
    {
      id: 'city',
      required: true,
      label: 'City',
      placeholder: '',
      value: 'city',
      disabled: true,
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
      // type: 'string',
      id: 'zipcode',
      required: true,
      label: 'Zipcode',
      placeholder: '',
      value: 'zipcode',
      pattern: '[0-9-]+',
    },
  ];
}
