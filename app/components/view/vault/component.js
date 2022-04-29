import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { NATIVE_MOBILE_ROUTE } from 'houseninja/data/enums/routes';
import { findAll } from 'ember-data-resources';

export default class VaultContentComponent extends Component {
  @service camera;
  @service file;
  @service router;
  @service haptics;
  @service view;

  @tracked showUploadMenu = false;

  documents = findAll(this, 'document');
  documentGroups = findAll(this, 'document-group');

  vaultGroupAddRoute = NATIVE_MOBILE_ROUTE.VAULT.GROUPS.NEW;

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
      this.selectRoute(NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.NEW);
    }
  }

  @action
  async getFileFromDevice() {
    await this.file.setFileServiceFile();
    if (this.file.file) {
      await this.toggleUploadMenu();
      this.selectRoute(NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.NEW);
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
  selectRoute(route, param) {
    if (param) {
      this.router.transitionTo(route, param);
    } else if (!param) {
      this.router.transitionTo(route);
    }
    this.view.preservePreviousRoute(this.router);
    this.haptics.giveFeedback();
  }

  @action
  handleRecordClick(record) {
    if (record.contentType) {
      this.selectRoute(NATIVE_MOBILE_ROUTE.VAULT.DOCUMENTS.SHOW, record.id);
    } else {
      this.selectRoute(NATIVE_MOBILE_ROUTE.VAULT.GROUPS.SHOW, record.id);
    }
  }
}
