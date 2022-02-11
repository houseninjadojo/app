import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TermsAndConditionsAgreementComponent extends Component {
  @action
  userHasServiceRecords(serviceRecords) {
    return serviceRecords.length > 0;
  }

  termsAndConditions = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend feugiat condimentum. Praesent consequat dictum condimentum. Donec molestie vestibulum diam, in euismod lacus accumsan ac. Fusce tristique convallis massa at rhoncus. Nam finibus hendrerit mauris, ac sagittis sem eleifend vitae. Nullam eget velit quis odio tristique faucibus eget vitae elit. Cras iaculis felis nulla, a malesuada leo feugiat quis. Morbi ipsum diam, hendrerit ac eros ac, egestas bibendum velit. Aenean viverra nulla a massa condimentum pulvinar. Nulla vitae ornare nisi, vulputate posuere ligula.
  
  Aliquam iaculis malesuada mauris, eget convallis felis ornare ut. Vestibulum leo arcu, molestie a leo et, aliquam lacinia neque. Phasellus purus diam, interdum vel pharetra eget, hendrerit sit amet est. Maecenas facilisis fermentum augue in fermentum. Nulla placerat, dui vitae commodo aliquam, nibh sem accumsan lorem, vel semper orci risus eget ligula. Aenean ullamcorper tempor scelerisque. In dapibus facilisis leo ut rutrum. Mauris justo enim, gravida porttitor leo in, accumsan tempor dui.
  
  Vivamus vulputate, libero ornare consectetur malesuada, nulla justo dictum turpis, pellentesque tincidunt mauris tortor a nunc. Duis ornare neque quis leo consequat laoreet. Nam et mi id felis pellentesque egestas. Phasellus eget ullamcorper massa, quis rhoncus nibh. Nulla eget semper ante. In rhoncus tristique lacinia. Ut euismod, libero ac imperdiet blandit, leo arcu feugiat risus, quis tincidunt erat risus vitae turpis. Aenean mollis nulla non purus tristique, a aliquam tellus consequat. Cras porttitor leo et bibendum pharetra.
  
  Vivamus viverra urna accumsan rutrum posuere. Mauris vel ante quis urna pellentesque feugiat. Pellentesque elementum nisi mi, ac molestie nisl elementum vel. Nullam vel tortor purus. Phasellus maximus turpis in pharetra sagittis. In eu congue ante, ut sodales arcu. Morbi sapien nisi, fermentum in leo eu, molestie eleifend risus. Nulla facilisis nisl quis turpis dapibus venenatis. Mauris vulputate ornare lectus, eu finibus enim auctor in. Proin id pretium leo, vel blandit nulla. Vivamus sed purus ipsum.
  
  Ut nec est vel diam finibus molestie aliquet venenatis ex. Pellentesque nec justo a justo pellentesque feugiat. Nulla egestas, elit et hendrerit blandit, leo ligula accumsan risus, at lobortis turpis lacus quis sem. Donec a quam purus. Donec pharetra elit felis, at blandit dolor vehicula et. Duis ultricies varius maximus. Mauris at venenatis sem. Sed fringilla, nulla a venenatis pellentesque, eros orci faucibus magna, id posuere metus dui eu ligula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. `;
}
