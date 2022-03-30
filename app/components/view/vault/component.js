import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Camera, CameraResultType } from '@capacitor/camera';
export default class VaultContentComponent extends Component {
  @service router;
  @service view;
  @service haptics;

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
      select: this.selectUploadOption,
    },
    {
      id: this.uploadMenuOptionType.photos,
      label: 'Select Photo from Library',
      select: this.selectUploadOption,
    },
    {
      id: this.uploadMenuOptionType.files,
      label: 'Upload a File',
      select: this.selectUploadOption,
    },
  ];

  @action
  toggleUploadMenu() {
    this.showUploadMenu = !this.showUploadMenu;
  }

  @action
  selectUploadOption(option) {
    switch (option.id) {
      case this.uploadMenuOptionType.camera:
        this.getPhoto(this.uploadMenuOptionType.camera);
        break;
      case this.uploadMenuOptionType.photos:
        this.getPhoto(this.uploadMenuOptionType.photos);
        break;
      case this.uploadMenuOptionType.files:
        return;
    }
  }

  async getPhoto(source) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    console.log('imageUrl', imageUrl);
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
    this.toggleUploadMenu();
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
