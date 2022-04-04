import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class VaultContentComponent extends Component {
  @service camera;
  @service file;
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
      label: 'Select from Photo Library',
      select: this.handleUploadSelection,
    },
    {
      id: this.uploadMenuOptionType.files,
      label: 'Select from Files',
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
  async getFileFromDevice() {
    await this.file.setFileServiceFile();
    if (this.file.file) {
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
        this.getFileFromDevice();
        break;
    }
  }

  @action
  selectRoute(route, param = null) {
    this.haptics.giveFeedback();
    if (param) {
      this.router.transitionTo(route, param);
    } else if (!param) {
      this.router.transitionTo(route);
    }
    this.view.preservePreviousRoute(this.router);
  }

  @action
  handleRecordClick(record) {
    if (record.contentType) {
      this.selectRoute('vault.document', record.id);
    } else {
      this.selectRoute('vault.group', record.id);
    }
  }
}
