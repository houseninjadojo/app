import Component from '@glimmer/component';

export default class NpsRatingComponent extends Component {
  npsOptions = [
    {
      label: '10 - Most likely',
      value: 10,
    },
    {
      label: '9',
      value: 9,
    },
    {
      label: '8',
      value: 8,
    },
    {
      label: '7',
      value: 7,
    },
    {
      label: '6',
      value: 6,
    },
    {
      label: '5',
      value: 5,
    },
    {
      label: '4',
      value: 4,
    },
    {
      label: '3',
      value: 3,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '1 - Least likely',
      value: 1,
    },
  ];
}
