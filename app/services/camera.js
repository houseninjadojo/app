import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Camera, CameraResultType } from '@capacitor/camera';

export default class CameraService extends Service {
  @tracked image = null;

  clearCameraServiceImage() {
    this.image = null;
  }

  async setCameraServiceImage(source) {
    this.image = await this.getImage(source);
  }

  async getImage(source) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source,
    });
    return image;
  }
}
