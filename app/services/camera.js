import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Camera, CameraResultType } from '@capacitor/camera';
import Sentry from 'houseninja/utils/sentry';

export default class CameraService extends Service {
  @tracked image = null;

  clear() {
    this.image = null;
  }

  async setCameraServiceImage(source) {
    this.image = await this.getImage(source);
  }

  async getImage(source) {
    Sentry.addBreadcrumb({
      type: 'ui',
      category: 'camera',
      message: 'taking a photo',
    });
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source,
      });
      return image;
    } catch (e) {
      console.log(e);
    }
  }
}
