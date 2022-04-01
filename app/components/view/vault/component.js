import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class VaultContentComponent extends Component {
  @service camera;
  @service router;
  @service haptics;
  @service view;

  @tracked showUploadMenu = false;

  uploadMenuOptionType = {
    camera: 'CAMERA',
    photos: 'PHOTOS',
    file: 'FILE',
  };

  uploadOptions = [
    {
      id: this.uploadMenuOptionType.camera,
      label: 'Take a Photo',
      select: this.handleUploadSelection,
    },
    {
      id: this.uploadMenuOptionType.photos,
      label: 'Select Photo from Library',
      select: this.handleUploadSelection,
    },
    {
      id: this.uploadMenuOptionType.files,
      label: 'Upload a File',
      select: this.handleUploadSelection,
    },
  ];

  @action
  toggleUploadMenu() {
    this.showUploadMenu = !this.showUploadMenu;
  }

  @action
  async setCameraServiceImage(source) {
    await this.camera.setCameraServiceImage(source);
    if (this.camera.image) {
      await this.toggleUploadMenu();
      this.selectRoute('vault.document.add');
    }
  }

  @action
  async handleUploadSelection(option) {
    switch (option.id) {
      case this.uploadMenuOptionType.camera:
        this.setCameraServiceImage(this.uploadMenuOptionType.camera);
        break;
      case this.uploadMenuOptionType.photos:
        this.setCameraServiceImage(this.uploadMenuOptionType.photos);
        break;
      case this.uploadMenuOptionType.files:
        break;
    }
  }

  @action
  selectRoute(route) {
    this.haptics.giveFeedback();
    if (route === 'vault.group.add') {
      this.router.transitionTo(route);
    }
    if (route === 'vault.document.add') {
      this.router.transitionTo(route);
    }
    if (typeof route === 'object') {
      if (route.type === 'group') {
        this.router.transitionTo(`vault.group`, route.id);
      }
      if (route.type !== 'group') {
        // view file
        this.router.transitionTo(`vault.document`, route.id);
      }
    }
    this.view.preservePreviousRoute(this.router);
  }
}
