import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ThumbnailGalleryComponent extends Component {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare loader: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare view: any;
  @service declare camera: any;

  @tracked showUploadMenu = false;

  uploadMenuOptionType = {
    camera: 'CAMERA',
    photos: 'PHOTOS',
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
  ];

  @action
  toggleUploadMenu() {
    this.showUploadMenu = !this.showUploadMenu;
  }

  @action
  async setCameraServiceImage(source: any) {
    await this.camera.setCameraServiceImage(source);
    if (this.camera.image) {
      await this.toggleUploadMenu();
    }
  }

  @action
  async handleUploadSelection(option: any) {
    switch (option.id) {
      case this.uploadMenuOptionType.camera:
        this.setCameraServiceImage(this.uploadMenuOptionType.camera);
        break;
      case this.uploadMenuOptionType.photos:
        this.setCameraServiceImage(this.uploadMenuOptionType.photos);
        break;
    }
  }
}
