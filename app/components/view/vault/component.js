import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class VaultContentComponent extends Component {
  @service router;
  @service view;
  @service haptics;

  @tracked showUploadMenu = false;

  uploadOptions = [
    {
      id: 'camera',
      label: 'Take Photo',
      select: this.selectUploadOption,
    },
    {
      id: 'library',
      label: 'Select from Photo Library',
      select: this.selectUploadOption,
    },
    {
      id: 'files',
      label: 'Select from Files',
      select: this.selectUploadOption,
    },
  ];

  @action
  toggleUploadMenu(){
    this.showUploadMenu = !this.showUploadMenu;
  }

  @action
  selectUploadOption(option) {
    console.log(option);
  }

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();
    if (route === 'vault.group.new') {
      this.router.transitionTo(route);
    }
    if (route === 'vault.upload') {
      this.router.transitionTo(route);
    }
    if (typeof route === 'object') {
      if (route.type === 'group') {
        this.router.transitionTo(`vault.group`, route.id);
      } else {
        this.router.transitionTo();
      }
      if (route.type !== 'group') {
        // view file
        this.router.transitionTo(`vault.document`, route.id);
      }
    }
    this.view.preservePreviousRoute(this.router);
  }
}
