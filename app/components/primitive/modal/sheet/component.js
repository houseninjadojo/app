import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class SheetComponent extends Component {
  @service router;
  @service view;

  @action
  async show() {}
}
