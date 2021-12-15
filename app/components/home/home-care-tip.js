import Component from '@glimmer/component';

export default class HomeCareTipComponent extends Component {
  homeCareTips = [
    {
      label: 'Tip Label',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec leo felis. Cras auctor at risus non blandit. Vivamus mattis vel nisl nec varius. Etiam sapien velit, cursus eu lacus nec, accumsan convallis ex. Praesent sit amet maximus dui.',
      showButton: true,
      defaultHNChatMessage: '',
    },
  ];
}
